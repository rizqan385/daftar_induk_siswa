package services

import (
	"fmt"
	"math"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"

	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

// RaportPreviewSiswa adalah data preview satu siswa dari file raport
type RaportPreviewSiswa struct {
	Nomor  int    `json:"nomor"`
	Nama   string `json:"nama"`
	NISN   string `json:"nisn"`
	Status string `json:"status"` // "new", "exists"
}

// RaportPreview adalah hasil preview sebelum import
type RaportPreview struct {
	NamaSekolah    string               `json:"nama_sekolah"`
	NamaKelas      string               `json:"nama_kelas"`
	WaliKelas      string               `json:"wali_kelas"`
	Semester       string               `json:"semester"`
	TahunPelajaran string               `json:"tahun_pelajaran"`
	JumlahSiswa    int                  `json:"jumlah_siswa"`
	MataPelajaran  []string             `json:"mata_pelajaran"`
	Siswa          []RaportPreviewSiswa `json:"siswa"`
}

// RaportImportResult adalah hasil import
type RaportImportResult struct {
	ImportedSiswa    int      `json:"imported_siswa"`
	UpdatedNilai     int      `json:"updated_nilai"`
	UpdatedCatatan   int      `json:"updated_catatan"`
	Errors           []string `json:"errors,omitempty"`
	KelasID          uint     `json:"kelas_id"`
}

// ImportRaportService handles raport excel import
type ImportRaportService struct {
	db           *gorm.DB
	siswaRepo    *repositories.SiswaRepository
	kelasRepo    *repositories.KelasRepository
	mapelRepo    *repositories.MataPelajaranRepository
	nilaiRepo    *repositories.NilaiSemesterRepository
	catatanRepo  *repositories.CatatanRepository
	kehadiranRepo *repositories.KehadiranRepository
}

// NewImportRaportService creates a new ImportRaportService
func NewImportRaportService(
	db *gorm.DB,
	siswaRepo *repositories.SiswaRepository,
	kelasRepo *repositories.KelasRepository,
	mapelRepo *repositories.MataPelajaranRepository,
	nilaiRepo *repositories.NilaiSemesterRepository,
	catatanRepo *repositories.CatatanRepository,
	kehadiranRepo *repositories.KehadiranRepository,
) *ImportRaportService {
	return &ImportRaportService{
		db:            db,
		siswaRepo:     siswaRepo,
		kelasRepo:     kelasRepo,
		mapelRepo:     mapelRepo,
		nilaiRepo:     nilaiRepo,
		catatanRepo:   catatanRepo,
		kehadiranRepo: kehadiranRepo,
	}
}

// raportSheetInfo menyimpan info yang dideteksi dari sheet LEGGER
type raportSheetInfo struct {
	namaSekolah    string
	namaKelas      string
	waliKelas      string
	semester       string
	tahunPelajaran string
	jumlahSiswa    int
	// kolom mapel: index kolom awal → nama mapel
	mapelCols map[int]string
	// baris data mulai dari
	dataStartRow int
}

func safeStr(val interface{}) string {
	if val == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprintf("%v", val))
}

func safeFloat(val interface{}) float64 {
	if val == nil {
		return 0
	}
	switch v := val.(type) {
	case float64:
		return v
	case int:
		return float64(v)
	case string:
		f, _ := strconv.ParseFloat(strings.TrimSpace(v), 64)
		return f
	}
	return 0
}

func safeInt(val interface{}) int {
	return int(math.Round(safeFloat(val)))
}

// openExcel membuka file multipart sebagai excelize
func openExcelFile(file *multipart.FileHeader) (*excelize.File, error) {
	f, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return excelize.OpenReader(f)
}

// detectLeggerInfo mendeteksi metadata dari sheet LEGGER
func detectLeggerInfo(xl *excelize.File, sheetName string) (*raportSheetInfo, error) {
	rows, err := xl.GetRows(sheetName)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca sheet %s: %w", sheetName, err)
	}

	info := &raportSheetInfo{mapelCols: make(map[int]string)}

	// Helper untuk cari nilai di row
	getCell := func(row []string, idx int) string {
		if idx < len(row) {
			return strings.TrimSpace(row[idx])
		}
		return ""
	}

	for i, row := range rows {
		rowNum := i + 1

		// Deteksi nama sekolah (biasanya baris 3)
		if rowNum == 3 && len(row) > 0 && row[0] != "" {
			info.namaSekolah = strings.TrimSpace(row[0])
		}

		// Deteksi dari baris yang mengandung "KELAS", "SEMESTER", "TAHUN PELAJARAN", "NAMA WALI KELAS"
		for j, cell := range row {
			cellUp := strings.ToUpper(strings.TrimSpace(cell))
			nextVal := getCell(row, j+2)
			if nextVal == "" {
				nextVal = getCell(row, j+1)
			}

			switch {
			case cellUp == "KELAS" && info.namaKelas == "":
				info.namaKelas = nextVal
			case (cellUp == "SEMESTER" || strings.Contains(cellUp, "SEMESTER")) && info.semester == "" && !strings.Contains(cellUp, "TAHUN"):
				if nextVal != "" && !strings.Contains(strings.ToUpper(nextVal), "PELAJARAN") {
					info.semester = nextVal
				}
			case (cellUp == "TAHUN  PELAJARAN" || cellUp == "TAHUN PELAJARAN") && info.tahunPelajaran == "":
				info.tahunPelajaran = strings.ReplaceAll(nextVal, " ", "")
			case (strings.Contains(cellUp, "NAMA WALI KELAS") || cellUp == "NAMA WALI KELAS") && info.waliKelas == "":
				info.waliKelas = nextVal
			case (strings.Contains(cellUp, "JUMLAH SISWA")) && info.jumlahSiswa == 0:
				if v, err := strconv.Atoi(strings.TrimSpace(nextVal)); err == nil {
					info.jumlahSiswa = v
				}
			}
		}

		// Baris header mapel: baris yang berisi nama mata pelajaran (biasanya row 12 = index 11)
		// Kita kunci spesifik untuk hindari string seperti "RERATA TUGAS/PH/Assessment" di baris 13
		if rowNum >= 10 && rowNum <= 15 {
			for j := 3; j < len(row); j += 5 {
				cellVal := strings.TrimSpace(row[j])
				if cellVal != "" && len(cellVal) > 5 && !strings.HasPrefix(cellVal, "KELOMPOK") && !strings.Contains(strings.ToUpper(cellVal), "RERATA TUGAS") {
					// Hanya overwrite kalau belum ada
					if _, exists := info.mapelCols[j]; !exists {
						info.mapelCols[j] = cellVal
					}
				}
			}
		}

		// Data start: baris setelah header, kolom 0 = angka (NO), kolom 1 = nama, kolom 2 = NISN
		if rowNum > 13 && len(row) > 2 {
			if _, err := strconv.Atoi(strings.TrimSpace(row[0])); err == nil {
				name := strings.TrimSpace(row[1])
				nisn := strings.TrimSpace(row[2])
				if name != "" && nisn != "" && nisn != "0" {
					if info.dataStartRow == 0 {
						info.dataStartRow = i
					}
					break
				}
			}
		}
	}

	return info, nil
}

// parseSemesterNumber mengekstrak angka semester dari string "1 (SATU)" → 1
func parseSemesterNumber(s string) uint8 {
	if strings.Contains(s, "1") || strings.Contains(strings.ToUpper(s), "GANJIL") || strings.Contains(strings.ToUpper(s), "SATU") {
		return 1
	}
	return 2
}

// parseTingkat mengekstrak tingkat dari nama kelas "XII AKL" → "XII"
func parseTingkat(namaKelas string) string {
	parts := strings.Fields(namaKelas)
	if len(parts) > 0 {
		tingkat := strings.ToUpper(parts[0])
		if tingkat == "X" || tingkat == "XI" || tingkat == "XII" {
			return tingkat
		}
	}
	return "XII"
}

// nilaiToPredikat mengkonversi nilai angka ke predikat huruf
func nilaiToPredikat(nilai float64) string {
	switch {
	case nilai >= 91:
		return "A"
	case nilai >= 83:
		return "B"
	case nilai >= 75:
		return "C"
	default:
		return "D"
	}
}

// PreviewRaport membaca file raport dan mengembalikan preview tanpa menyimpan ke DB
func (s *ImportRaportService) PreviewRaport(file *multipart.FileHeader) (*RaportPreview, error) {
	xl, err := openExcelFile(file)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka file: %w", err)
	}
	defer xl.Close()

	sheets := xl.GetSheetList()
	if len(sheets) == 0 {
		return nil, fmt.Errorf("file tidak memiliki sheet")
	}

	// Cari sheet LEGGER
	leggerSheet := ""
	catatanSheet := ""
	for _, s := range sheets {
		up := strings.ToUpper(s)
		if strings.Contains(up, "LEGGER") {
			leggerSheet = s
		}
		if strings.Contains(up, "CATATAN") {
			catatanSheet = s
		}
	}
	if leggerSheet == "" {
		leggerSheet = sheets[0]
	}

	info, err := detectLeggerInfo(xl, leggerSheet)
	if err != nil {
		return nil, err
	}

	// Coba ambil catatan wali dari sheet CATATAN WALAS jika ada
	catatan := make(map[string]string) // nisn → catatan
	if catatanSheet != "" {
		cRows, _ := xl.GetRows(catatanSheet)
		for _, row := range cRows {
			if len(row) < 6 {
				continue
			}
			nisn := strings.TrimSpace(row[2])
			cat := strings.TrimSpace(row[5])
			if nisn != "" && nisn != "N I S N" && cat != "" {
				catatan[nisn] = cat
			}
		}
	}

	rows, _ := xl.GetRows(leggerSheet)

	preview := &RaportPreview{
		NamaSekolah:    info.namaSekolah,
		NamaKelas:      info.namaKelas,
		WaliKelas:      info.waliKelas,
		Semester:       info.semester,
		TahunPelajaran: info.tahunPelajaran,
		JumlahSiswa:    info.jumlahSiswa,
		MataPelajaran:  []string{},
	}

	for _, nama := range info.mapelCols {
		preview.MataPelajaran = append(preview.MataPelajaran, nama)
	}

	// Parse data siswa
	for i := info.dataStartRow; i < len(rows); i++ {
		row := rows[i]
		if len(row) < 3 {
			continue
		}
		no := strings.TrimSpace(row[0])
		nama := strings.TrimSpace(row[1])
		nisn := strings.TrimSpace(row[2])

		if no == "" || nama == "" || nisn == "" || nisn == "0" {
			continue
		}
		if _, err := strconv.Atoi(no); err != nil {
			continue
		}

		status := "new"
		exists, _ := s.siswaRepo.ExistsByNISN(nisn)
		if exists {
			status = "exists"
		}

		noInt, _ := strconv.Atoi(no)
		preview.Siswa = append(preview.Siswa, RaportPreviewSiswa{
			Nomor:  noInt,
			Nama:   nama,
			NISN:   nisn,
			Status: status,
		})
	}

	_ = catatan
	return preview, nil
}

// ImportRaport mengimport seluruh data raport ke database
func (s *ImportRaportService) ImportRaport(file *multipart.FileHeader) (*RaportImportResult, error) {
	xl, err := openExcelFile(file)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka file: %w", err)
	}
	defer xl.Close()

	sheets := xl.GetSheetList()
	if len(sheets) == 0 {
		return nil, fmt.Errorf("file tidak memiliki sheet")
	}

	leggerSheet := ""
	catatanSheet := ""
	for _, sh := range sheets {
		up := strings.ToUpper(sh)
		if strings.Contains(up, "LEGGER") {
			leggerSheet = sh
		}
		if strings.Contains(up, "CATATAN") {
			catatanSheet = sh
		}
	}
	if leggerSheet == "" {
		leggerSheet = sheets[0]
	}

	info, err := detectLeggerInfo(xl, leggerSheet)
	if err != nil {
		return nil, err
	}

	result := &RaportImportResult{}
	var errs []string

	semester := parseSemesterNumber(info.semester)
	tahunPelajaran := info.tahunPelajaran
	tingkat := parseTingkat(info.namaKelas)

	// 1. Cari atau buat Kelas
	kelasID, err := s.findOrCreateKelas(info)
	if err != nil {
		return nil, fmt.Errorf("gagal proses kelas: %w", err)
	}
	result.KelasID = kelasID

	// 2. Load/buat MataPelajaran dari mapelCols
	mapelIDMap, err := s.findOrCreateMapel(info.mapelCols)
	if err != nil {
		return nil, fmt.Errorf("gagal proses mata pelajaran: %w", err)
	}

	// 3. Baca catatan dari sheet CATATAN WALAS
	catatanMap := make(map[string]string) // nisn → catatan
	if catatanSheet != "" {
		cRows, _ := xl.GetRows(catatanSheet)
		for _, row := range cRows {
			if len(row) < 6 {
				continue
			}
			nisn := strings.TrimSpace(row[2])
			cat := strings.TrimSpace(row[5])
			if nisn != "" && nisn != "N I S N" && cat != "" && nisn != "0" {
				catatanMap[nisn] = cat
			}
		}
	}

	// 4. Parse baris data dari LEGGER
	rows, _ := xl.GetRows(leggerSheet)
	fallbackDate, _ := time.Parse("2006-01-02", "2000-01-01")

	for i := info.dataStartRow; i < len(rows); i++ {
		row := rows[i]
		if len(row) < 3 {
			continue
		}
		noStr := strings.TrimSpace(row[0])
		nama := strings.TrimSpace(row[1])
		nisn := strings.TrimSpace(row[2])

		if noStr == "" || nama == "" || nisn == "" || nisn == "0" {
			continue
		}
		if _, err := strconv.Atoi(noStr); err != nil {
			continue
		}

		// 4a. Cari atau buat siswa berdasarkan NISN
		siswaID, wasNew, err := s.findOrCreateSiswa(nisn, nama, kelasID, fallbackDate)
		if err != nil {
			errs = append(errs, fmt.Sprintf("Siswa %s (%s): %v", nama, nisn, err))
			continue
		}
		if wasNew {
			result.ImportedSiswa++
		}

		// 4b. Simpan NilaiSemester per mapel
		for startCol, mapelNama := range info.mapelCols {
			mapelID, ok := mapelIDMap[mapelNama]
			if !ok {
				continue
			}

			// Kolom layout per mapel: startCol=Tugas, +2=PAS, +4=Nilai Akhir
			nilaiAkhirCol := startCol + 4
			nilaiAkhir := 0.0
			if nilaiAkhirCol < len(row) {
				nilaiAkhir = safeFloat(row[nilaiAkhirCol])
			}
			if nilaiAkhir == 0 {
				// coba pakai col +3
				if startCol+3 < len(row) {
					nilaiAkhir = safeFloat(row[startCol+3])
				}
			}

			nilaiInt := uint(math.Round(nilaiAkhir))
			predikat := nilaiToPredikat(nilaiAkhir)

			nilai := &models.NilaiSemester{
				SiswaID:              siswaID,
				MataPelajaranID:      mapelID,
				Kelas:                tingkat,
				Semester:             semester,
				TahunPelajaran:       tahunPelajaran,
				NilaiPengetahuan:     nilaiInt,
				PredikatPengetahuan:  predikat,
				NilaiKeterampilan:    nilaiInt,
				PredikatKeterampilan: predikat,
			}

			if err := s.nilaiRepo.Upsert(nilai); err == nil {
				result.UpdatedNilai++
			}
		}

		// 4c. Simpan absensi (kolom 68=Sakit, 69=Izin, 70=Alpa)
		sakit, izin, alpa := 0, 0, 0
		if 68 < len(row) {
			sakit = safeInt(row[68])
		}
		if 69 < len(row) {
			izin = safeInt(row[69])
		}
		if 70 < len(row) {
			alpa = safeInt(row[70])
		}
		s.upsertKehadiran(siswaID, tingkat, semester, sakit, izin, alpa)

		// 4d. Simpan catatan wali kelas
		catatan := catatanMap[nisn]
		if catatan != "" {
			cas := &models.CatatanAkhirSemester{
				SiswaID:          siswaID,
				Kelas:            tingkat,
				Semester:         semester,
				CatatanWaliKelas: catatan,
			}
			// Cek apakah sudah ada
			var existing models.CatatanAkhirSemester
			err := s.db.Where("siswa_id = ? AND kelas = ? AND semester = ?", siswaID, tingkat, semester).First(&existing).Error
			if err != nil {
				s.db.Create(cas)
			} else {
				s.db.Model(&existing).Update("catatan_wali_kelas", catatan)
			}
			result.UpdatedCatatan++
		}
	}

	result.Errors = errs
	return result, nil
}

// findOrCreateKelas cari atau buat kelas berdasarkan info
func (s *ImportRaportService) findOrCreateKelas(info *raportSheetInfo) (uint, error) {
	namaKelas := strings.TrimSpace(info.namaKelas)
	if namaKelas == "" {
		return 0, fmt.Errorf("nama kelas tidak ditemukan dalam file")
	}

	kelas, err := s.kelasRepo.FindByName(namaKelas)
	if err == nil {
		// Update wali kelas jika berubah
		if info.waliKelas != "" && kelas.WaliKelas != info.waliKelas {
			kelas.WaliKelas = info.waliKelas
			_ = s.kelasRepo.Update(kelas)
		}
		return kelas.ID, nil
	}

	// Buat baru
	tingkat := parseTingkat(namaKelas)
	jurusan := ""
	parts := strings.Fields(namaKelas)
	if len(parts) > 1 {
		jurusan = strings.Join(parts[1:], " ")
	}

	tp := strings.ReplaceAll(info.tahunPelajaran, " ", "")

	newKelas := &models.Kelas{
		Nama:           namaKelas,
		Tingkat:        tingkat,
		Jurusan:        jurusan,
		TahunPelajaran: tp,
		WaliKelas:      info.waliKelas,
	}
	if err := s.kelasRepo.Create(newKelas); err != nil {
		return 0, err
	}
	return newKelas.ID, nil
}

// findOrCreateMapel cari atau buat mata pelajaran
func (s *ImportRaportService) findOrCreateMapel(mapelCols map[int]string) (map[string]uint, error) {
	result := make(map[string]uint)

	allMapel, _ := s.mapelRepo.FindAll()
	mapelByName := make(map[string]uint)
	for _, m := range allMapel {
		mapelByName[strings.ToLower(strings.TrimSpace(m.Nama))] = m.ID
	}

	for _, nama := range mapelCols {
		namaTrimmed := strings.TrimSpace(nama)
		key := strings.ToLower(namaTrimmed)

		if id, ok := mapelByName[key]; ok {
			result[namaTrimmed] = id
			continue
		}

		// Tentukan kelompok berdasarkan nama
		kelompok := "A"
		kelompokUp := strings.ToUpper(namaTrimmed)
		if strings.Contains(kelompokUp, "MATEMATIKA") ||
			strings.Contains(kelompokUp, "BAHASA INGGRIS") ||
			strings.Contains(kelompokUp, "KONSENTRASI") ||
			strings.Contains(kelompokUp, "PROJEK") ||
			strings.Contains(kelompokUp, "SPREADSHEET") ||
			strings.Contains(kelompokUp, "DESIGN") {
			kelompok = "C"
		} else if strings.Contains(kelompokUp, "SENI") ||
			strings.Contains(kelompokUp, "PJOK") ||
			strings.Contains(kelompokUp, "JASMANI") {
			kelompok = "B"
		}

		kode := fmt.Sprintf("MP%03d", len(result)+1)
		newMapel := &models.MataPelajaran{
			Kode:     kode,
			Nama:     namaTrimmed,
			Kelompok: kelompok,
			Aktif:    true,
		}
		if err := s.db.Create(newMapel).Error; err != nil {
			// Coba cari lagi (race condition)
			if id, ok := mapelByName[key]; ok {
				result[namaTrimmed] = id
			}
			continue
		}
		result[namaTrimmed] = newMapel.ID
		mapelByName[key] = newMapel.ID
	}

	return result, nil
}

// findOrCreateSiswa cari siswa berdasarkan NISN, kalau tidak ada buat baru
func (s *ImportRaportService) findOrCreateSiswa(nisn, nama string, kelasID uint, fallbackDate time.Time) (uint, bool, error) {
	existing, err := s.siswaRepo.FindByNISN(nisn)
	if err == nil {
		// Update kelas jika berbeda
		if existing.KelasID == nil || *existing.KelasID != kelasID {
			existing.KelasID = &kelasID
			_ = s.siswaRepo.Update(existing)
		}
		return existing.ID, false, nil
	}

	// Generate noInduk unik dari NISN
	noInduk := "NIS-" + nisn

	// Cek apakah noInduk sudah ada
	existsByNI, _ := s.siswaRepo.ExistsByNoInduk(noInduk)
	if existsByNI {
		noInduk = noInduk + "-" + strconv.FormatInt(time.Now().UnixNano()%1000, 10)
	}

	firstName := nama
	if parts := strings.Fields(nama); len(parts) > 0 {
		firstName = parts[0]
	}

	siswa := &models.Siswa{
		NISN:            nisn,
		NoInduk:         noInduk,
		Nama:            nama,
		NamaPanggilan:   firstName,
		JenisKelamin:    "P", // default, bisa diupdate manual
		TempatLahir:     "-",
		TanggalLahir:    fallbackDate,
		Agama:           "Islam",
		Kewarganegaraan: "WNI",
		BahasaRumah:     "Indonesia",
		AnakKe:          1,
		Status:          "aktif",
		KelasID:         &kelasID,
	}

	if err := s.siswaRepo.Create(siswa); err != nil {
		return 0, false, err
	}
	return siswa.ID, true, nil
}

// upsertKehadiran simpan atau update data kehadiran
func (s *ImportRaportService) upsertKehadiran(siswaID uint, kelas string, semester uint8, sakit, izin, alpa int) {
	var existing models.Kehadiran
	err := s.db.Where("siswa_id = ? AND kelas = ? AND semester = ?", siswaID, kelas, semester).First(&existing).Error
	if err != nil {
		// Buat baru
		k := &models.Kehadiran{
			SiswaID:     siswaID,
			Kelas:       kelas,
			Semester:    semester,
			JumlahSakit: uint(sakit),
			JumlahIzin:  uint(izin),
			JumlahAlpa:  uint(alpa),
		}
		s.db.Create(k)
	} else {
		s.db.Model(&existing).Updates(map[string]interface{}{
			"jumlah_sakit": sakit,
			"jumlah_izin":  izin,
			"jumlah_alpa":  alpa,
		})
	}
}

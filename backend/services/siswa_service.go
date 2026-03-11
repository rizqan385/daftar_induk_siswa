package services

import (
	"errors"
	"fmt"
	"mime/multipart"
	"strings"
	"time"

	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

// SiswaService handles student business logic
type SiswaService struct {
	siswaRepo     *repositories.SiswaRepository
	alamatRepo    *repositories.AlamatRepository
	orangTuaRepo  *repositories.OrangTuaRepository
	waliRepo      *repositories.WaliRepository
	kesehatanRepo *repositories.KesehatanRepository
	kelasRepo     *repositories.KelasRepository
}

// NewSiswaService creates a new SiswaService
func NewSiswaService(
	siswaRepo *repositories.SiswaRepository,
	alamatRepo *repositories.AlamatRepository,
	orangTuaRepo *repositories.OrangTuaRepository,
	waliRepo *repositories.WaliRepository,
	kesehatanRepo *repositories.KesehatanRepository,
	kelasRepo *repositories.KelasRepository,
) *SiswaService {
	return &SiswaService{
		siswaRepo:     siswaRepo,
		alamatRepo:    alamatRepo,
		orangTuaRepo:  orangTuaRepo,
		waliRepo:      waliRepo,
		kesehatanRepo: kesehatanRepo,
		kelasRepo:     kelasRepo,
	}
}

// Create creates a new student
func (s *SiswaService) Create(req requests.CreateSiswaRequest) (*responses.SiswaDetailResponse, error) {
	// Validate NISN
	if !utils.ValidateNISN(req.NISN) {
		return nil, errors.New("NISN must be 10 digits")
	}

	// Check if NISN exists
	exists, err := s.siswaRepo.ExistsByNISN(req.NISN)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("NISN already exists")
	}

	// Check if NoInduk exists
	exists, err = s.siswaRepo.ExistsByNoInduk(req.NoInduk)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("school registration number already exists")
	}

	// Parse date
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	// Create siswa
	siswa := &models.Siswa{
		NoInduk:         utils.SanitizeString(req.NoInduk),
		NISN:            req.NISN,
		NamaLengkap:     utils.SanitizeString(req.NamaLengkap),
		NamaPanggilan:   utils.SanitizeString(req.NamaPanggilan),
		JenisKelamin:    req.JenisKelamin,
		TempatLahir:     utils.SanitizeString(req.TempatLahir),
		TanggalLahir:    tanggalLahir,
		Agama:           utils.SanitizeString(req.Agama),
		AnakKe:          req.AnakKe,
		JumlahSaudara:   req.JumlahSaudara,
		Kewarganegaraan: utils.SanitizeString(req.Kewarganegaraan),
		BahasaRumah:     utils.SanitizeString(req.BahasaRumah),
		Status:          req.Status,
	}
	if req.KelasID > 0 {
		siswa.KelasID = &req.KelasID
	}

	if err := s.siswaRepo.Create(siswa); err != nil {
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// FindByID finds a student by ID
func (s *SiswaService) FindByID(id uint) (*responses.SiswaDetailResponse, error) {
	siswa, err := s.siswaRepo.FindByIDWithRelations(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// FindAll finds all students with pagination
func (s *SiswaService) FindAll(req requests.PaginationRequest) ([]responses.SiswaListResponse, utils.Pagination, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 || req.PageSize > 100 {
		req.PageSize = 20
	}

	siswaList, total, err := s.siswaRepo.FindAll(req.Page, req.PageSize, req.Search, req.SortBy, req.SortDir)
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	var response []responses.SiswaListResponse
	for _, siswa := range siswaList {
		var kelasRef *responses.KelasResponse
		if siswa.Kelas != nil {
			kelasRef = &responses.KelasResponse{
				ID:        siswa.Kelas.ID,
				Nama:      siswa.Kelas.Nama,
				WaliKelas: siswa.Kelas.WaliKelas,
				Tingkat:   siswa.Kelas.Tingkat,
			}
		}

		response = append(response, responses.SiswaListResponse{
			ID:           siswa.ID,
			NoInduk:      siswa.NoInduk,
			NISN:         siswa.NISN,
			NamaLengkap:  siswa.NamaLengkap,
			JenisKelamin: siswa.JenisKelamin,
			KelasID:      siswa.KelasID,
			KelasRef:     kelasRef,
			FotoPath:     siswa.FotoPath,
			Status:       siswa.Status,
			CreatedAt:    siswa.CreatedAt,
		})
	}

	totalPages := int(total) / req.PageSize
	if int(total)%req.PageSize > 0 {
		totalPages++
	}

	pagination := utils.Pagination{
		Page:       req.Page,
		PageSize:   req.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return response, pagination, nil
}

// Update updates a student
func (s *SiswaService) Update(id uint, req requests.UpdateSiswaRequest) (*responses.SiswaDetailResponse, error) {
	siswa, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Update fields if provided
	if req.NamaLengkap != "" {
		siswa.NamaLengkap = utils.SanitizeString(req.NamaLengkap)
	}
	if req.NamaPanggilan != "" {
		siswa.NamaPanggilan = utils.SanitizeString(req.NamaPanggilan)
	}
	if req.JenisKelamin != "" {
		siswa.JenisKelamin = req.JenisKelamin
	}
	if req.TempatLahir != "" {
		siswa.TempatLahir = utils.SanitizeString(req.TempatLahir)
	}
	if req.TanggalLahir != "" {
		tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
		siswa.TanggalLahir = tanggalLahir
	}
	if req.Agama != "" {
		siswa.Agama = utils.SanitizeString(req.Agama)
	}
	if req.AnakKe > 0 {
		siswa.AnakKe = req.AnakKe
	}
	siswa.JumlahSaudara = req.JumlahSaudara
	if req.Kewarganegaraan != "" {
		siswa.Kewarganegaraan = utils.SanitizeString(req.Kewarganegaraan)
	}
	if req.BahasaRumah != "" {
		siswa.BahasaRumah = utils.SanitizeString(req.BahasaRumah)
	}
	if req.KelasID > 0 {
		siswa.KelasID = &req.KelasID
	}
	if req.Status != "" {
		siswa.Status = req.Status
	}

	if err := s.siswaRepo.Update(siswa); err != nil {
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// Delete soft deletes a student
func (s *SiswaService) Delete(id uint) error {
	_, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("student not found")
		}
		return err
	}

	return s.siswaRepo.Delete(id)
}

// UploadFoto uploads student photo
func (s *SiswaService) UploadFoto(id uint, file *multipart.FileHeader) (string, error) {
	// Validate student exists
	siswa, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("student not found")
		}
		return "", err
	}

	// Validate image file
	if err := utils.ValidateImageFile(file); err != nil {
		return "", err
	}

	// Delete old photo if exists
	if siswa.FotoPath != "" {
		_ = utils.DeleteFile(siswa.FotoPath)
	}

	// Save new photo
	fotoPath, err := utils.SaveUploadedFile(file, "photos")
	if err != nil {
		return "", err
	}

	// Update database
	if err := s.siswaRepo.UpdateFotoPath(id, fotoPath); err != nil {
		return "", err
	}

	return fotoPath, nil
}

// toDetailResponse converts model to response
func (s *SiswaService) toDetailResponse(siswa *models.Siswa) *responses.SiswaDetailResponse {
	resp := &responses.SiswaDetailResponse{
		ID:              siswa.ID,
		NoInduk:         siswa.NoInduk,
		NISN:            siswa.NISN,
		NamaLengkap:     siswa.NamaLengkap,
		NamaPanggilan:   siswa.NamaPanggilan,
		JenisKelamin:    siswa.JenisKelamin,
		TempatLahir:     siswa.TempatLahir,
		TanggalLahir:    siswa.TanggalLahir,
		Agama:           siswa.Agama,
		AnakKe:          siswa.AnakKe,
		JumlahSaudara:   siswa.JumlahSaudara,
		Kewarganegaraan: siswa.Kewarganegaraan,
		BahasaRumah:     siswa.BahasaRumah,
		KelasID:         siswa.KelasID,
		FotoPath:        siswa.FotoPath,
		Status:          siswa.Status,
		CreatedAt:       siswa.CreatedAt,
		UpdatedAt:       siswa.UpdatedAt,
	}

	// Map related data
	if siswa.Alamat != nil {
		resp.Alamat = &responses.AlamatResponse{
			ID:             siswa.Alamat.ID,
			AlamatLengkap:  siswa.Alamat.AlamatLengkap,
			Kelurahan:      siswa.Alamat.Kelurahan,
			Kecamatan:      siswa.Alamat.Kecamatan,
			Kota:           siswa.Alamat.Kota,
			Provinsi:       siswa.Alamat.Provinsi,
			KodePos:        siswa.Alamat.KodePos,
			NoTelepon:      siswa.Alamat.NoTelepon,
			TinggalDengan:  siswa.Alamat.TinggalDengan,
			JarakKeSekolah: siswa.Alamat.JarakKeSekolah,
			Transportasi:   siswa.Alamat.Transportasi,
		}
	}

	for _, ortu := range siswa.OrangTua {
		resp.OrangTua = append(resp.OrangTua, responses.OrangTuaResponse{
			ID:                 ortu.ID,
			Tipe:               ortu.Tipe,
			Nama:               ortu.Nama,
			TempatLahir:        ortu.TempatLahir,
			TanggalLahir:       ortu.TanggalLahir,
			Kewarganegaraan:    ortu.Kewarganegaraan,
			PendidikanTerakhir: ortu.PendidikanTerakhir,
			Pekerjaan:          ortu.Pekerjaan,
			PenghasilanBulanan: ortu.PenghasilanBulanan,
			Alamat:             ortu.Alamat,
			NoTelepon:          ortu.NoTelepon,
			MasihHidup:         ortu.MasihHidup,
		})
	}

	if siswa.Wali != nil {
		resp.Wali = &responses.WaliResponse{
			ID:                  siswa.Wali.ID,
			Nama:                siswa.Wali.Nama,
			JenisKelamin:        siswa.Wali.JenisKelamin,
			TempatLahir:         siswa.Wali.TempatLahir,
			TanggalLahir:        siswa.Wali.TanggalLahir,
			Kewarganegaraan:     siswa.Wali.Kewarganegaraan,
			PendidikanTerakhir:  siswa.Wali.PendidikanTerakhir,
			Pekerjaan:           siswa.Wali.Pekerjaan,
			PenghasilanBulanan:  siswa.Wali.PenghasilanBulanan,
			Alamat:              siswa.Wali.Alamat,
			NoTelepon:           siswa.Wali.NoTelepon,
			HubunganDenganSiswa: siswa.Wali.HubunganDenganSiswa,
		}
	}

	if siswa.Kesehatan != nil {
		resp.Kesehatan = &responses.KesehatanResponse{
			ID:                 siswa.Kesehatan.ID,
			BeratBadanMasuk:    siswa.Kesehatan.BeratBadanMasuk,
			TinggiBadanMasuk:   siswa.Kesehatan.TinggiBadanMasuk,
			BeratBadanKeluar:   siswa.Kesehatan.BeratBadanKeluar,
			TinggiBadanKeluar:  siswa.Kesehatan.TinggiBadanKeluar,
			GolonganDarah:      siswa.Kesehatan.GolonganDarah,
			KesanggupanJasmani: siswa.Kesehatan.KesanggupanJasmani,
		}
		for _, rp := range siswa.Kesehatan.RiwayatPenyakit {
			resp.Kesehatan.RiwayatPenyakit = append(resp.Kesehatan.RiwayatPenyakit, responses.RiwayatPenyakitResponse{
				ID:            rp.ID,
				JenisPenyakit: rp.JenisPenyakit,
				Tahun:         rp.Tahun,
				LamaSakit:     rp.LamaSakit,
				Keterangan:    rp.Keterangan,
			})
		}
	}

	for _, pend := range siswa.PendidikanSebelumnya {
		resp.PendidikanSebelumnya = append(resp.PendidikanSebelumnya, responses.PendidikanResponse{
			ID:              pend.ID,
			Tipe:            pend.Tipe,
			TanggalDiterima: pend.TanggalDiterima,
			AsalSekolah:     pend.AsalSekolah,
			AlamatSekolah:   pend.AlamatSekolah,
			NoIjazah:        pend.NoIjazah,
			TanggalIjazah:   pend.TanggalIjazah,
			NoSKHUN:         pend.NoSKHUN,
			TanggalSKHUN:    pend.TanggalSKHUN,
			KelasDiterima:   pend.KelasDiterima,
			AlasanPindah:    pend.AlasanPindah,
		})
	}

	for _, k := range siswa.Kepribadian {
		resp.Kepribadian = append(resp.Kepribadian, responses.KepribadianResponse{
			ID:             k.ID,
			Aspek:          k.Aspek,
			Nilai:          k.Nilai,
			TahunPelajaran: k.TahunPelajaran,
		})
	}

	for _, pr := range siswa.Prestasi {
		resp.Prestasi = append(resp.Prestasi, responses.PrestasiResponse{
			ID:           pr.ID,
			Bidang:       pr.Bidang,
			NamaPrestasi: pr.NamaPrestasi,
			Keterangan:   pr.Keterangan,
			Tahun:        pr.Tahun,
			Tingkat:    pr.Tingkat,
		})
	}

	for _, b := range siswa.Beasiswa {
		resp.Beasiswa = append(resp.Beasiswa, responses.BeasiswaResponse{
			ID:             b.ID,
			TahunPelajaran: b.TahunPelajaran,
			Pemberi:        b.Pemberi,
			Keterangan:     b.Keterangan,
		})
	}

	for _, k := range siswa.Kehadiran {
		resp.Kehadiran = append(resp.Kehadiran, responses.KehadiranResponse{
			ID:                k.ID,
			Kelas:             k.Kelas,
			Semester:          k.Semester,
			JumlahHadir:       k.JumlahHadir,
			PersentaseHadir:   k.PersentaseHadir,
			JumlahSakit:       k.JumlahSakit,
			JumlahIzin:        k.JumlahIzin,
			JumlahAlpa:        k.JumlahAlpa,
			JumlahHariEfektif: k.JumlahHariEfektif,
		})
	}

	for _, ns := range siswa.NilaiSemester {
		nresp := responses.NilaiSemesterResponse{
			ID:                    ns.ID,
			Kelas:                 ns.Kelas,
			Semester:              ns.Semester,
			TahunPelajaran:        ns.TahunPelajaran,
			NilaiPengetahuan:      ns.NilaiPengetahuan,
			PredikatPengetahuan:   ns.PredikatPengetahuan,
			DeskripsiPengetahuan:  ns.DeskripsiPengetahuan,
			NilaiKeterampilan:     ns.NilaiKeterampilan,
			PredikatKeterampilan:  ns.PredikatKeterampilan,
			DeskripsiKeterampilan: ns.DeskripsiKeterampilan,
		}
		if ns.MataPelajaran != nil {
			nresp.MataPelajaran = &responses.MataPelajaranResponse{
				ID:          ns.MataPelajaran.ID,
				Kode:        ns.MataPelajaran.Kode,
				Nama:        ns.MataPelajaran.Nama,
				Kelompok:    ns.MataPelajaran.Kelompok,
				SubKelompok: ns.MataPelajaran.SubKelompok,
			}
		}
		resp.NilaiSemester = append(resp.NilaiSemester, nresp)
	}

	for _, sikap := range siswa.NilaiSikap {
		resp.NilaiSikap = append(resp.NilaiSikap, responses.NilaiSikapResponse{
			ID:                 sikap.ID,
			Kelas:              sikap.Kelas,
			Semester:           sikap.Semester,
			DeskripsiSpiritual: sikap.DeskripsiSpiritual,
			DeskripsiSosial:    sikap.DeskripsiSosial,
		})
	}

	for _, c := range siswa.CatatanAkhirSemester {
		cresp := responses.CatatanSemesterResponse{
			ID:               c.ID,
			Kelas:            c.Kelas,
			Semester:         c.Semester,
			CatatanWaliKelas: c.CatatanWaliKelas,
		}
		for _, pkl := range c.PKL {
			cresp.PKL = append(cresp.PKL, responses.PKLResponse{
				ID:         pkl.ID,
				NamaDUDI:   pkl.NamaDUDI,
				Lokasi:     pkl.Lokasi,
				LamaBulan:  pkl.LamaBulan,
				Keterangan: pkl.Keterangan,
			})
		}
		for _, eks := range c.Ekstrakurikuler {
			cresp.Ekstrakurikuler = append(cresp.Ekstrakurikuler, responses.EkstrakurikulerResponse{
				ID:           eks.ID,
				NamaKegiatan: eks.NamaKegiatan,
				Nilai:        eks.Nilai,
				Keterangan:   eks.Keterangan,
			})
		}
		for _, pres := range c.PrestasiSemester {
			cresp.PrestasiSemester = append(cresp.PrestasiSemester, responses.PrestasiSemesterResponse{
				ID:            pres.ID,
				JenisPrestasi: pres.JenisPrestasi,
				Keterangan:    pres.Keterangan,
			})
		}
		if c.Ketidakhadiran != nil {
			cresp.Ketidakhadiran = &responses.KetidakhadiranResponse{
				ID:              c.Ketidakhadiran.ID,
				KarenaSakit:     c.Ketidakhadiran.KarenaSakit,
				DenganIzin:      c.Ketidakhadiran.DenganIzin,
				TanpaKeterangan: c.Ketidakhadiran.TanpaKeterangan,
			}
		}
		resp.CatatanSemester = append(resp.CatatanSemester, cresp)
	}

	for _, ni := range siswa.NilaiIjazah {
		nresp := responses.NilaiIjazahResponse{
			ID:           ni.ID,
			NilaiAkhir:   ni.NilaiAkhir,
			TahunLulus:   ni.TahunLulus,
			NoIjazah:     ni.NoIjazah,
			TanggalLulus: ni.TanggalLulus,
		}
		if ni.MataPelajaran != nil {
			nresp.MataPelajaran = &responses.MataPelajaranResponse{
				ID:          ni.MataPelajaran.ID,
				Kode:        ni.MataPelajaran.Kode,
				Nama:        ni.MataPelajaran.Nama,
				Kelompok:    ni.MataPelajaran.Kelompok,
				SubKelompok: ni.MataPelajaran.SubKelompok,
			}
		}
		resp.NilaiIjazah = append(resp.NilaiIjazah, nresp)
	}

	if siswa.MeninggalkanSekolah != nil {
		resp.MeninggalkanSekolah = &responses.MeninggalkanSekolahResponse{
			ID:                  siswa.MeninggalkanSekolah.ID,
			Tipe:                siswa.MeninggalkanSekolah.Tipe,
			Tanggal:             siswa.MeninggalkanSekolah.Tanggal,
			SekolahTujuan:       siswa.MeninggalkanSekolah.SekolahTujuan,
			AlamatSekolahTujuan: siswa.MeninggalkanSekolah.AlamatSekolahTujuan,
			NoIjazah:            siswa.MeninggalkanSekolah.NoIjazah,
			Alasan:              siswa.MeninggalkanSekolah.Alasan,
		}
	}

	return resp
}

// AddMeninggalkanSekolah adds leaving school record
func (s *SiswaService) AddMeninggalkanSekolah(siswaID uint, req requests.CreateMeninggalkanSekolahRequest) (*responses.MeninggalkanSekolahResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Parse date
	parsedTanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	data := &models.MeninggalkanSekolah{
		SiswaID:             siswaID,
		Tipe:                req.Tipe,
		Tanggal:             parsedTanggal,
		SekolahTujuan:       utils.SanitizeString(req.SekolahTujuan),
		AlamatSekolahTujuan: utils.SanitizeString(req.AlamatSekolahTujuan),
		NoIjazah:            utils.SanitizeString(req.NoIjazah),
		Alasan:              utils.SanitizeString(req.Alasan),
	}

	if err := s.siswaRepo.AddMeninggalkanSekolah(data); err != nil {
		return nil, err
	}

	// Automatic status update to "keluar" 
	// So frontend UI can display "Tidak Aktif Lagi"
	_ = s.siswaRepo.UpdateStatus(siswaID, "keluar")

	return &responses.MeninggalkanSekolahResponse{
		ID:                  data.ID,
		Tipe:                data.Tipe,
		Tanggal:             data.Tanggal,
		SekolahTujuan:       data.SekolahTujuan,
		AlamatSekolahTujuan: data.AlamatSekolahTujuan,
		NoIjazah:            data.NoIjazah,
		Alasan:              data.Alasan,
	}, nil
}

// DeleteMeninggalkanSekolah deletes a leaving school record and resets the status
func (s *SiswaService) DeleteMeninggalkanSekolah(siswaID uint) error {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("student not found")
		}
		return err
	}

	if err := s.siswaRepo.DeleteMeninggalkanSekolah(siswaID); err != nil {
		return err
	}

	// Automatic status update back to "aktif" since they are no longer marked as leaving
	return s.siswaRepo.UpdateStatus(siswaID, "aktif")
}

// ImportExcel parses an uploaded Excel file and batch inserts student basic info.
func (s *SiswaService) ImportExcel(file *multipart.FileHeader) (int, error) {
	// Open multipart file
	f, err := file.Open()
	if err != nil {
		return 0, fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer f.Close()

	// Parse excel
	xl, err := excelize.OpenReader(f)
	if err != nil {
		return 0, fmt.Errorf("failed to parse excel file: %w", err)
	}
	defer xl.Close()

	// Get first sheet
	sheets := xl.GetSheetList()
	if len(sheets) == 0 {
		return 0, errors.New("excel file contains no sheets")
	}
	sheetName := sheets[0]

	rows, err := xl.GetRows(sheetName)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve rows from sheet: %w", err)
	}

	if len(rows) < 2 {
		return 0, errors.New("excel file contains no data rows")
	}

	importedCount := 0
	var importErrors []string

	// Hardcoded fallback date for 'TanggalLahir'
	fallbackDate, _ := time.Parse("2006-01-02", "2000-01-01")

	// Preload all class names to map them to IDs and cache to avoid multiple queries
	dbKelas, err := s.kelasRepo.FindAll()
	if err != nil {
		return 0, fmt.Errorf("failed to load kelas for mapping: %w", err)
	}
	kelasObjMap := make(map[string]uint)
	for _, k := range dbKelas {
		kelasObjMap[strings.ToLower(strings.TrimSpace(k.Nama))] = k.ID
	}

	// Begin processing rows starting from index 1 (skip header at index 0)
	for i, row := range rows[1:] {
		rowNum := i + 2 // 1-indexed + skip header

		// Pad row to at least 5 columns (some empty trailing cells are omitted by excelize)
		for len(row) < 5 {
			row = append(row, "")
		}

		nisn := strings.TrimSpace(row[0])
		noInduk := strings.TrimSpace(row[1])
		nama := strings.TrimSpace(row[2])
		gender := strings.ToUpper(strings.TrimSpace(row[3]))
		kelasName := strings.TrimSpace(row[4])

		// Skip completely empty rows
		if nisn == "" && noInduk == "" && nama == "" {
			continue
		}

		// Validate minimum required fields
		if nisn == "" {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d: NISN kosong", rowNum))
			continue
		}
		if noInduk == "" {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d: NIS kosong", rowNum))
			continue
		}
		if nama == "" {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d: Nama kosong", rowNum))
			continue
		}

		// Ensure valid gender format
		if gender != "L" && gender != "P" {
			gender = "L"
		}

		// Check duplicates
		exists, _ := s.siswaRepo.ExistsByNISN(nisn)
		if exists {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d: NISN %s sudah ada", rowNum, nisn))
			continue
		}
		exists, _ = s.siswaRepo.ExistsByNoInduk(noInduk)
		if exists {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d: NIS %s sudah ada", rowNum, noInduk))
			continue
		}

		siswa := &models.Siswa{
			NISN:            nisn,
			NoInduk:         noInduk,
			NamaLengkap:     utils.SanitizeString(nama),
			NamaPanggilan:   utils.SanitizeString(strings.Split(nama, " ")[0]),
			JenisKelamin:    gender,
			KelasID:         nil,
			TempatLahir:     "-",
			TanggalLahir:    fallbackDate,
			Agama:           "Islam",
			Kewarganegaraan: "WNI",
			BahasaRumah:     "Indonesia",
			AnakKe:          1,
			Status:          "aktif",
		}

		// Class mapping resolving
		if kelasName != "" {
			if id, ok := kelasObjMap[strings.ToLower(kelasName)]; ok {
				clsID := id
				siswa.KelasID = &clsID
			}
		}

		// Insert into db
		if err := s.siswaRepo.Create(siswa); err != nil {
			importErrors = append(importErrors, fmt.Sprintf("Baris %d (%s): %v", rowNum, nama, err))
		} else {
			importedCount++
		}
	}

	if importedCount == 0 && len(importErrors) > 0 {
		// Return at most first 5 errors
		maxErr := 5
		if len(importErrors) < maxErr {
			maxErr = len(importErrors)
		}
		return 0, fmt.Errorf("Tidak ada data yang berhasil diimport. Errors: %s", strings.Join(importErrors[:maxErr], "; "))
	}

	return importedCount, nil
}

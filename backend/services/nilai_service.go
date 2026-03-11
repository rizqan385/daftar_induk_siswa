package services

import (
	"errors"
	"time"

	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"

	"gorm.io/gorm"
)

// NilaiService handles grade business logic
// NilaiService handles grade business logic
type NilaiService struct {
	siswaRepo     *repositories.SiswaRepository
	mapelRepo     *repositories.MataPelajaranRepository
	nilaiRepo     *repositories.NilaiSemesterRepository
	sikapRepo     *repositories.NilaiSikapRepository
	catatanRepo   *repositories.CatatanRepository
	ijazahRepo    *repositories.NilaiIjazahRepository
	kehadiranRepo *repositories.KehadiranRepository
}

// NewNilaiService creates a new NilaiService
func NewNilaiService(
	siswaRepo *repositories.SiswaRepository,
	mapelRepo *repositories.MataPelajaranRepository,
	nilaiRepo *repositories.NilaiSemesterRepository,
	sikapRepo *repositories.NilaiSikapRepository,
	catatanRepo *repositories.CatatanRepository,
	ijazahRepo *repositories.NilaiIjazahRepository,
	kehadiranRepo *repositories.KehadiranRepository,
) *NilaiService {
	return &NilaiService{
		siswaRepo:     siswaRepo,
		mapelRepo:     mapelRepo,
		nilaiRepo:     nilaiRepo,
		sikapRepo:     sikapRepo,
		catatanRepo:   catatanRepo,
		ijazahRepo:    ijazahRepo,
		kehadiranRepo: kehadiranRepo,
	}
}

// GetAllMataPelajaran gets all subjects
func (s *NilaiService) GetAllMataPelajaran() ([]responses.MataPelajaranResponse, error) {
	mapel, err := s.mapelRepo.FindAll()
	if err != nil {
		return nil, err
	}

	var result []responses.MataPelajaranResponse
	for _, m := range mapel {
		result = append(result, responses.MataPelajaranResponse{
			ID:          m.ID,
			Kode:        m.Kode,
			Nama:        m.Nama,
			Kelompok:     m.Kelompok,
			SubKelompok:  m.SubKelompok,
			KelasTarget1: m.KelasTarget1,
			KelasTarget2: m.KelasTarget2,
		})
	}
	return result, nil
}

// CreateNilaiSemester creates a semester grade
func (s *NilaiService) CreateNilaiSemester(siswaID uint, req requests.CreateNilaiSemesterRequest) (*responses.NilaiSemesterResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Validate subject exists
	mapel, err := s.mapelRepo.FindByID(req.MataPelajaranID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("subject not found")
		}
		return nil, err
	}

	// Create nilai
	nilai := &models.NilaiSemester{
		SiswaID:               siswaID,
		MataPelajaranID:       req.MataPelajaranID,
		Kelas:                 req.Kelas,
		Semester:              req.Semester,
		TahunPelajaran:        utils.SanitizeString(req.TahunPelajaran),
		NilaiPengetahuan:      req.NilaiPengetahuan,
		PredikatPengetahuan:   req.PredikatPengetahuan,
		DeskripsiPengetahuan:  utils.SanitizeString(req.DeskripsiPengetahuan),
		NilaiKeterampilan:     req.NilaiKeterampilan,
		PredikatKeterampilan:  req.PredikatKeterampilan,
		DeskripsiKeterampilan: utils.SanitizeString(req.DeskripsiKeterampilan),
	}

	if err := s.nilaiRepo.Upsert(nilai); err != nil {
		return nil, err
	}

	return &responses.NilaiSemesterResponse{
		ID: nilai.ID,
		MataPelajaran: &responses.MataPelajaranResponse{
			ID:          mapel.ID,
			Kode:        mapel.Kode,
			Nama:        mapel.Nama,
			Kelompok:    mapel.Kelompok,
			SubKelompok: mapel.SubKelompok,
		},
		Kelas:                 nilai.Kelas,
		Semester:              nilai.Semester,
		TahunPelajaran:        nilai.TahunPelajaran,
		NilaiPengetahuan:      nilai.NilaiPengetahuan,
		PredikatPengetahuan:   nilai.PredikatPengetahuan,
		DeskripsiPengetahuan:  nilai.DeskripsiPengetahuan,
		NilaiKeterampilan:     nilai.NilaiKeterampilan,
		PredikatKeterampilan:  nilai.PredikatKeterampilan,
		DeskripsiKeterampilan: nilai.DeskripsiKeterampilan,
	}, nil
}

// BatchCreateNilaiSemester creates multiple semester grades
func (s *NilaiService) BatchCreateNilaiSemester(siswaID uint, req requests.BatchNilaiSemesterRequest) ([]responses.NilaiSemesterResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	var nilaiList []models.NilaiSemester
	for _, n := range req.Nilai {
		// Validate subject exists
		_, err := s.mapelRepo.FindByID(n.MataPelajaranID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("subject not found")
			}
			return nil, err
		}

		nilaiList = append(nilaiList, models.NilaiSemester{
			SiswaID:               siswaID,
			MataPelajaranID:       n.MataPelajaranID,
			Kelas:                 n.Kelas,
			Semester:              n.Semester,
			TahunPelajaran:        utils.SanitizeString(n.TahunPelajaran),
			NilaiPengetahuan:      n.NilaiPengetahuan,
			PredikatPengetahuan:   n.PredikatPengetahuan,
			DeskripsiPengetahuan:  utils.SanitizeString(n.DeskripsiPengetahuan),
			NilaiKeterampilan:     n.NilaiKeterampilan,
			PredikatKeterampilan:  n.PredikatKeterampilan,
			DeskripsiKeterampilan: utils.SanitizeString(n.DeskripsiKeterampilan),
		})
	}

	if err := s.nilaiRepo.CreateBatch(nilaiList); err != nil {
		return nil, err
	}

	// Fetch created nilai with mata pelajaran
	hasil, err := s.GetNilaiSemester(siswaID, requests.NilaiFilterRequest{})
	if err != nil {
		return nil, err
	}

	return hasil, nil
}

// UpdateNilaiSemester updates an existing semester grade by ID
func (s *NilaiService) UpdateNilaiSemester(id uint, req requests.UpdateNilaiSemesterRequest) (*responses.NilaiSemesterResponse, error) {
	nilai, err := s.nilaiRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("grade not found")
		}
		return nil, err
	}

	nilai.TahunPelajaran = utils.SanitizeString(req.TahunPelajaran)
	nilai.NilaiPengetahuan = req.NilaiPengetahuan
	nilai.PredikatPengetahuan = req.PredikatPengetahuan
	nilai.DeskripsiPengetahuan = utils.SanitizeString(req.DeskripsiPengetahuan)
	nilai.NilaiKeterampilan = req.NilaiKeterampilan
	nilai.PredikatKeterampilan = req.PredikatKeterampilan
	nilai.DeskripsiKeterampilan = utils.SanitizeString(req.DeskripsiKeterampilan)

	if err := s.nilaiRepo.Update(nilai); err != nil {
		return nil, err
	}

	var mapelResp *responses.MataPelajaranResponse
	if nilai.MataPelajaran != nil {
		mapelResp = &responses.MataPelajaranResponse{
			ID:          nilai.MataPelajaran.ID,
			Kode:        nilai.MataPelajaran.Kode,
			Nama:        nilai.MataPelajaran.Nama,
			Kelompok:    nilai.MataPelajaran.Kelompok,
			SubKelompok: nilai.MataPelajaran.SubKelompok,
		}
	}

	return &responses.NilaiSemesterResponse{
		ID:                    nilai.ID,
		MataPelajaran:         mapelResp,
		Kelas:                 nilai.Kelas,
		Semester:              nilai.Semester,
		TahunPelajaran:        nilai.TahunPelajaran,
		NilaiPengetahuan:      nilai.NilaiPengetahuan,
		PredikatPengetahuan:   nilai.PredikatPengetahuan,
		DeskripsiPengetahuan:  nilai.DeskripsiPengetahuan,
		NilaiKeterampilan:     nilai.NilaiKeterampilan,
		PredikatKeterampilan:  nilai.PredikatKeterampilan,
		DeskripsiKeterampilan: nilai.DeskripsiKeterampilan,
	}, nil
}

// GetNilaiSemester gets semester grades for a student
func (s *NilaiService) GetNilaiSemester(siswaID uint, filter requests.NilaiFilterRequest) ([]responses.NilaiSemesterResponse, error) {
	nilaiList, err := s.nilaiRepo.FindBySiswaIDFiltered(siswaID, filter.Kelas, filter.Semester, filter.TahunPelajaran)
	if err != nil {
		return nil, err
	}

	var result []responses.NilaiSemesterResponse
	for _, n := range nilaiList {
		resp := responses.NilaiSemesterResponse{
			ID:                    n.ID,
			Kelas:                 n.Kelas,
			Semester:              n.Semester,
			TahunPelajaran:        n.TahunPelajaran,
			NilaiPengetahuan:      n.NilaiPengetahuan,
			PredikatPengetahuan:   n.PredikatPengetahuan,
			DeskripsiPengetahuan:  n.DeskripsiPengetahuan,
			NilaiKeterampilan:     n.NilaiKeterampilan,
			PredikatKeterampilan:  n.PredikatKeterampilan,
			DeskripsiKeterampilan: n.DeskripsiKeterampilan,
		}

		if n.MataPelajaran != nil {
			resp.MataPelajaran = &responses.MataPelajaranResponse{
				ID:          n.MataPelajaran.ID,
				Kode:        n.MataPelajaran.Kode,
				Nama:        n.MataPelajaran.Nama,
				Kelompok:    n.MataPelajaran.Kelompok,
				SubKelompok: n.MataPelajaran.SubKelompok,
			}
		}

		result = append(result, resp)
	}

	return result, nil
}

// CreateKehadiran creates or updates attendance record (UPSERT by siswa_id, kelas, semester)
func (s *NilaiService) CreateKehadiran(siswaID uint, req requests.CreateKehadiranRequest) (*responses.KehadiranResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Find existing record with same unique key
	existingKehadiran, errFind := s.kehadiranRepo.FindBySiswaIDAndKelas(siswaID, req.Kelas, req.Semester)
	if errFind != nil && !errors.Is(errFind, gorm.ErrRecordNotFound) {
		return nil, errFind
	}

	if existingKehadiran != nil && existingKehadiran.ID > 0 {
		existingKehadiran.JumlahHadir = req.JumlahHadir
		existingKehadiran.PersentaseHadir = req.PersentaseHadir
		existingKehadiran.JumlahSakit = req.JumlahSakit
		existingKehadiran.JumlahIzin = req.JumlahIzin
		existingKehadiran.JumlahAlpa = req.JumlahAlpa
		existingKehadiran.JumlahHariEfektif = req.JumlahHariEfektif
		if err := s.kehadiranRepo.Update(existingKehadiran); err != nil {
			return nil, err
		}
		return &responses.KehadiranResponse{
			ID: existingKehadiran.ID, Kelas: existingKehadiran.Kelas, Semester: existingKehadiran.Semester,
			JumlahHadir: existingKehadiran.JumlahHadir, PersentaseHadir: existingKehadiran.PersentaseHadir,
			JumlahSakit: existingKehadiran.JumlahSakit, JumlahIzin: existingKehadiran.JumlahIzin,
			JumlahAlpa: existingKehadiran.JumlahAlpa, JumlahHariEfektif: existingKehadiran.JumlahHariEfektif,
		}, nil
	}

	kehadiran := &models.Kehadiran{
		SiswaID:           siswaID,
		Kelas:             req.Kelas,
		Semester:          req.Semester,
		JumlahHadir:       req.JumlahHadir,
		PersentaseHadir:   req.PersentaseHadir,
		JumlahSakit:       req.JumlahSakit,
		JumlahIzin:        req.JumlahIzin,
		JumlahAlpa:        req.JumlahAlpa,
		JumlahHariEfektif: req.JumlahHariEfektif,
	}

	if err := s.kehadiranRepo.Create(kehadiran); err != nil {
		return nil, err
	}

	return &responses.KehadiranResponse{
		ID:                kehadiran.ID,
		Kelas:             kehadiran.Kelas,
		Semester:          kehadiran.Semester,
		JumlahHadir:       kehadiran.JumlahHadir,
		PersentaseHadir:   kehadiran.PersentaseHadir,
		JumlahSakit:       kehadiran.JumlahSakit,
		JumlahIzin:        kehadiran.JumlahIzin,
		JumlahAlpa:        kehadiran.JumlahAlpa,
		JumlahHariEfektif: kehadiran.JumlahHariEfektif,
	}, nil
}

// CreateNilaiSikap creates or updates attitude record (UPSERT by siswa_id, kelas, semester)
func (s *NilaiService) CreateNilaiSikap(siswaID uint, req requests.CreateNilaiSikapRequest) (*responses.NilaiSikapResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Find existing record with same unique key
	existingSikap, errFind := s.sikapRepo.FindBySiswaIDAndKelas(siswaID, req.Kelas, req.Semester)
	if errFind != nil && !errors.Is(errFind, gorm.ErrRecordNotFound) {
		return nil, errFind
	}

	if existingSikap != nil && existingSikap.ID > 0 {
		// Update existing
		existingSikap.DeskripsiSpiritual = utils.SanitizeString(req.DeskripsiSpiritual)
		existingSikap.DeskripsiSosial = utils.SanitizeString(req.DeskripsiSosial)
		if err := s.sikapRepo.Update(existingSikap); err != nil {
			return nil, err
		}
		return &responses.NilaiSikapResponse{
			ID: existingSikap.ID, Kelas: existingSikap.Kelas, Semester: existingSikap.Semester,
			DeskripsiSpiritual: existingSikap.DeskripsiSpiritual, DeskripsiSosial: existingSikap.DeskripsiSosial,
		}, nil
	}

	sikap := &models.NilaiSikap{
		SiswaID:            siswaID,
		Kelas:              req.Kelas,
		Semester:           req.Semester,
		DeskripsiSpiritual: utils.SanitizeString(req.DeskripsiSpiritual),
		DeskripsiSosial:    utils.SanitizeString(req.DeskripsiSosial),
	}

	if err := s.sikapRepo.Create(sikap); err != nil {
		return nil, err
	}

	return &responses.NilaiSikapResponse{
		ID:                 sikap.ID,
		Kelas:              sikap.Kelas,
		Semester:           sikap.Semester,
		DeskripsiSpiritual: sikap.DeskripsiSpiritual,
		DeskripsiSosial:    sikap.DeskripsiSosial,
	}, nil
}

// CreateNilaiIjazah creates certificate grade
func (s *NilaiService) CreateNilaiIjazah(siswaID uint, req requests.CreateNilaiIjazahRequest) (*responses.NilaiIjazahResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Validate subject exists
	mapel, err := s.mapelRepo.FindByID(req.MataPelajaranID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("subject not found")
		}
		return nil, err
	}

	// Parse date if provided
	var tanggalLulus *time.Time
	if req.TanggalLulus != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalLulus)
		if err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
		tanggalLulus = &parsed
	}

	nilai := &models.NilaiIjazah{
		SiswaID:         siswaID,
		MataPelajaranID: req.MataPelajaranID,
		NilaiAkhir:      req.NilaiAkhir,
		TahunLulus:      utils.SanitizeString(req.TahunLulus),
		NoIjazah:        utils.SanitizeString(req.NoIjazah),
		TanggalLulus:    tanggalLulus,
	}

	if err := s.ijazahRepo.Create(nilai); err != nil {
		return nil, err
	}

	return &responses.NilaiIjazahResponse{
		ID: nilai.ID,
		MataPelajaran: &responses.MataPelajaranResponse{
			ID:          mapel.ID,
			Kode:        mapel.Kode,
			Nama:        mapel.Nama,
			Kelompok:    mapel.Kelompok,
			SubKelompok: mapel.SubKelompok,
		},
		NilaiAkhir:   nilai.NilaiAkhir,
		TahunLulus:   nilai.TahunLulus,
		NoIjazah:     nilai.NoIjazah,
		TanggalLulus: nilai.TanggalLulus,
	}, nil
}

// GetNilaiIjazah gets certificate grades for a student
func (s *NilaiService) GetNilaiIjazah(siswaID uint) ([]responses.NilaiIjazahResponse, error) {
	nilaiList, err := s.ijazahRepo.FindBySiswaID(siswaID)
	if err != nil {
		return nil, err
	}

	var result []responses.NilaiIjazahResponse
	for _, n := range nilaiList {
		resp := responses.NilaiIjazahResponse{
			ID:           n.ID,
			NilaiAkhir:   n.NilaiAkhir,
			TahunLulus:   n.TahunLulus,
			NoIjazah:     n.NoIjazah,
			TanggalLulus: n.TanggalLulus,
		}

		if n.MataPelajaran != nil {
			resp.MataPelajaran = &responses.MataPelajaranResponse{
				ID:          n.MataPelajaran.ID,
				Kode:        n.MataPelajaran.Kode,
				Nama:        n.MataPelajaran.Nama,
				Kelompok:    n.MataPelajaran.Kelompok,
				SubKelompok: n.MataPelajaran.SubKelompok,
			}
		}

		result = append(result, resp)
	}

	return result, nil
}

// CreateCatatanSemester creates semester notes
func (s *NilaiService) CreateCatatanSemester(siswaID uint, req requests.CreateCatatanSemesterRequest) (*responses.CatatanSemesterResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	catatan := &models.CatatanAkhirSemester{
		SiswaID:          siswaID,
		Kelas:            req.Kelas,
		Semester:         req.Semester,
		CatatanWaliKelas: req.CatatanWaliKelas,
	}

	if err := s.catatanRepo.Create(catatan); err != nil {
		return nil, err
	}

	return &responses.CatatanSemesterResponse{
		ID:               catatan.ID,
		Kelas:            catatan.Kelas,
		Semester:         catatan.Semester,
		CatatanWaliKelas: catatan.CatatanWaliKelas,
	}, nil
}

// UpdateCatatanSemester updates the wali kelas note for an existing CAS
func (s *NilaiService) UpdateCatatanSemester(id uint, req requests.UpdateCatatanSemesterRequest) (*responses.CatatanSemesterResponse, error) {
	catatan, err := s.catatanRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("semester notes not found")
		}
		return nil, err
	}

	catatan.CatatanWaliKelas = req.CatatanWaliKelas
	if err := s.catatanRepo.Update(catatan); err != nil {
		return nil, err
	}

	return &responses.CatatanSemesterResponse{
		ID:               catatan.ID,
		Kelas:            catatan.Kelas,
		Semester:         catatan.Semester,
		CatatanWaliKelas: catatan.CatatanWaliKelas,
	}, nil
}

// GetCatatanSemester gets semester notes for a student
func (s *NilaiService) GetCatatanSemester(siswaID uint) ([]responses.CatatanSemesterResponse, error) {
	catatanList, err := s.catatanRepo.FindBySiswaID(siswaID)
	if err != nil {
		return nil, err
	}

	var result []responses.CatatanSemesterResponse
	for _, c := range catatanList {
		resp := responses.CatatanSemesterResponse{
			ID:               c.ID,
			Kelas:            c.Kelas,
			Semester:         c.Semester,
			CatatanWaliKelas: c.CatatanWaliKelas,
		}

		for _, pkl := range c.PKL {
			resp.PKL = append(resp.PKL, responses.PKLResponse{
				ID:         pkl.ID,
				NamaDUDI:   pkl.NamaDUDI,
				Lokasi:     pkl.Lokasi,
				LamaBulan:  pkl.LamaBulan,
				Keterangan: pkl.Keterangan,
			})
		}

		for _, eks := range c.Ekstrakurikuler {
			resp.Ekstrakurikuler = append(resp.Ekstrakurikuler, responses.EkstrakurikulerResponse{
				ID:           eks.ID,
				NamaKegiatan: eks.NamaKegiatan,
				Nilai:        eks.Nilai,
				Keterangan:   eks.Keterangan,
			})
		}

		for _, pres := range c.PrestasiSemester {
			resp.PrestasiSemester = append(resp.PrestasiSemester, responses.PrestasiSemesterResponse{
				ID:            pres.ID,
				JenisPrestasi: pres.JenisPrestasi,
				Keterangan:    pres.Keterangan,
			})
		}

		if c.Ketidakhadiran != nil {
			resp.Ketidakhadiran = &responses.KetidakhadiranResponse{
				ID:              c.Ketidakhadiran.ID,
				KarenaSakit:     c.Ketidakhadiran.KarenaSakit,
				DenganIzin:      c.Ketidakhadiran.DenganIzin,
				TanpaKeterangan: c.Ketidakhadiran.TanpaKeterangan,
			}
		}

		result = append(result, resp)
	}

	return result, nil
}

// AddPKL adds internship to semester notes
func (s *NilaiService) AddPKL(catatanID uint, req requests.CreatePKLRequest) (*responses.PKLResponse, error) {
	// Validate catatan exists
	_, err := s.catatanRepo.FindByID(catatanID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("semester notes not found")
		}
		return nil, err
	}

	pkl := &models.PraktikKerjaLapangan{
		CatatanID:  catatanID,
		NamaDUDI:   utils.SanitizeString(req.NamaDUDI),
		Lokasi:     utils.SanitizeString(req.Lokasi),
		LamaBulan:  req.LamaBulan,
		Keterangan: utils.SanitizeString(req.Keterangan),
	}

	if err := s.catatanRepo.AddPKL(pkl); err != nil {
		return nil, err
	}

	return &responses.PKLResponse{
		ID:         pkl.ID,
		NamaDUDI:   pkl.NamaDUDI,
		Lokasi:     pkl.Lokasi,
		LamaBulan:  pkl.LamaBulan,
		Keterangan: pkl.Keterangan,
	}, nil
}

// AddEkstrakurikuler adds extracurricular activity to semester notes
func (s *NilaiService) AddEkstrakurikuler(catatanID uint, req requests.CreateEkstrakurikulerRequest) (*responses.EkstrakurikulerResponse, error) {
	// Validate catatan exists
	_, err := s.catatanRepo.FindByID(catatanID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("semester notes not found")
		}
		return nil, err
	}

	ekskul := &models.Ekstrakurikuler{
		CatatanID:    catatanID,
		NamaKegiatan: utils.SanitizeString(req.NamaKegiatan),
		Nilai:        utils.SanitizeString(req.Nilai),
		Keterangan:   utils.SanitizeString(req.Keterangan),
	}

	if err := s.catatanRepo.AddEkstrakurikuler(ekskul); err != nil {
		return nil, err
	}

	return &responses.EkstrakurikulerResponse{
		ID:           ekskul.ID,
		NamaKegiatan: ekskul.NamaKegiatan,
		Nilai:        ekskul.Nilai,
		Keterangan:   ekskul.Keterangan,
	}, nil
}

// UpdatePKL updates internship record
func (s *NilaiService) UpdatePKL(id uint, req requests.CreatePKLRequest) (*responses.PKLResponse, error) {
	pkl, err := s.catatanRepo.FindPKLByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("pkl record not found")
		}
		return nil, err
	}

	pkl.NamaDUDI = utils.SanitizeString(req.NamaDUDI)
	pkl.Lokasi = utils.SanitizeString(req.Lokasi)
	pkl.LamaBulan = req.LamaBulan
	pkl.Keterangan = utils.SanitizeString(req.Keterangan)

	if err := s.catatanRepo.UpdatePKL(pkl); err != nil {
		return nil, err
	}

	return &responses.PKLResponse{
		ID:         pkl.ID,
		NamaDUDI:   pkl.NamaDUDI,
		Lokasi:     pkl.Lokasi,
		LamaBulan:  pkl.LamaBulan,
		Keterangan: pkl.Keterangan,
	}, nil
}

// DeletePKL deletes internship record
func (s *NilaiService) DeletePKL(id uint) error {
	_, err := s.catatanRepo.FindPKLByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("pkl record not found")
		}
		return err
	}
	return s.catatanRepo.DeletePKL(id)
}

// UpdateEkstrakurikuler updates extracurricular activity record
func (s *NilaiService) UpdateEkstrakurikuler(id uint, req requests.CreateEkstrakurikulerRequest) (*responses.EkstrakurikulerResponse, error) {
	ekskul, err := s.catatanRepo.FindEkstrakurikulerByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("extracurricular record not found")
		}
		return nil, err
	}

	ekskul.NamaKegiatan = utils.SanitizeString(req.NamaKegiatan)
	ekskul.Nilai = utils.SanitizeString(req.Nilai)
	ekskul.Keterangan = utils.SanitizeString(req.Keterangan)

	if err := s.catatanRepo.UpdateEkstrakurikuler(ekskul); err != nil {
		return nil, err
	}

	return &responses.EkstrakurikulerResponse{
		ID:           ekskul.ID,
		NamaKegiatan: ekskul.NamaKegiatan,
		Nilai:        ekskul.Nilai,
		Keterangan:   ekskul.Keterangan,
	}, nil
}

// DeleteEkstrakurikuler deletes extracurricular activity record
func (s *NilaiService) DeleteEkstrakurikuler(id uint) error {
	_, err := s.catatanRepo.FindEkstrakurikulerByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("extracurricular record not found")
		}
		return err
	}
	return s.catatanRepo.DeleteEkstrakurikuler(id)
}

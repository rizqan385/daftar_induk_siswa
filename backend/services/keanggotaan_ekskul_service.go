package services

import (
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"errors"
)

type KeanggotaanEkskulService struct {
	repo *repositories.KeanggotaanEkskulRepository
}

func NewKeanggotaanEkskulService(repo *repositories.KeanggotaanEkskulRepository) *KeanggotaanEkskulService {
	return &KeanggotaanEkskulService{repo: repo}
}

func (s *KeanggotaanEkskulService) Add(req requests.CreateKeanggotaanEkskulRequest) (*responses.KeanggotaanEkskulResponse, error) {
	data := &models.KeanggotaanEkskul{
		SiswaID:      req.SiswaID,
		NamaKegiatan: req.NamaKegiatan,
		Keterangan:   req.Keterangan,
	}

	if err := s.repo.Create(data); err != nil {
		return nil, err
	}

	return s.GetByID(data.ID)
}

func (s *KeanggotaanEkskulService) GetAll() ([]responses.KeanggotaanEkskulResponse, error) {
	items, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	var res []responses.KeanggotaanEkskulResponse
	for _, item := range items {
		nama := ""
		kelas := ""
		if item.Siswa != nil {
			nama = item.Siswa.NamaLengkap
			if item.Siswa.Kelas != nil {
				kelas = item.Siswa.Kelas.Nama
			}
		}
		
		res = append(res, responses.KeanggotaanEkskulResponse{
			ID:           item.ID,
			SiswaID:      item.SiswaID,
			SiswaNama:    nama,
			SiswaKelas:   kelas,
			NamaKegiatan: item.NamaKegiatan,
			Keterangan:   item.Keterangan,
		})
	}
	return res, nil
}

func (s *KeanggotaanEkskulService) GetByID(id uint) (*responses.KeanggotaanEkskulResponse, error) {
	item, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	nama := ""
	kelas := ""
	if item.Siswa != nil {
		nama = item.Siswa.NamaLengkap
		// We might need an extra query or preload for Kelas in FindByID, but it's optional here.
	}

	return &responses.KeanggotaanEkskulResponse{
		ID:           item.ID,
		SiswaID:      item.SiswaID,
		SiswaNama:    nama,
		SiswaKelas:   kelas,
		NamaKegiatan: item.NamaKegiatan,
		Keterangan:   item.Keterangan,
	}, nil
}

func (s *KeanggotaanEkskulService) Update(id uint, req requests.CreateKeanggotaanEkskulRequest) (*responses.KeanggotaanEkskulResponse, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("data not found")
	}

	existing.NamaKegiatan = req.NamaKegiatan
	existing.Keterangan = req.Keterangan

	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}

	return s.GetByID(id)
}

func (s *KeanggotaanEkskulService) Delete(id uint) error {
	return s.repo.Delete(id)
}

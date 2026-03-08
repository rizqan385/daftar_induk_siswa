package services

import (
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/utils"
)

// GetNilaiSemesterPaginated gets semester grades for a student with pagination
func (s *NilaiService) GetNilaiSemesterPaginated(siswaID uint, filter requests.NilaiFilterRequest, page, pageSize int) ([]responses.NilaiSemesterResponse, utils.Pagination, error) {
	// Convert filter request to map for repository
	filterMap := make(map[string]interface{})
	if filter.Kelas != "" {
		filterMap["kelas"] = filter.Kelas
	}
	if filter.Semester > 0 {
		filterMap["semester"] = filter.Semester
	}
	if filter.TahunPelajaran != "" {
		filterMap["tahun_pelajaran"] = filter.TahunPelajaran
	}

	nilaiList, total, err := s.nilaiRepo.FindBySiswaIDPaginated(siswaID, filterMap, page, pageSize, "kelas, semester", "asc")
	if err != nil {
		return nil, utils.Pagination{}, err
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

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	pagination := utils.Pagination{
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return result, pagination, nil
}

// GetKehadiranPaginated gets attendance records for a student with pagination
func (s *NilaiService) GetKehadiranPaginated(siswaID uint, page, pageSize int) ([]responses.KehadiranResponse, utils.Pagination, error) {
	kehadiranList, total, err := s.kehadiranRepo.FindBySiswaIDPaginated(siswaID, page, pageSize)
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	var result []responses.KehadiranResponse
	for _, k := range kehadiranList {
		result = append(result, responses.KehadiranResponse{
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

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	pagination := utils.Pagination{
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return result, pagination, nil
}

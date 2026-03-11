package handlers

import (
	"daftar_induk_siswa/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DashboardHandler struct {
	db *gorm.DB
}

func NewDashboardHandler(db *gorm.DB) *DashboardHandler {
	return &DashboardHandler{db: db}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	type GenderCount struct {
		JenisKelamin string `json:"jenis_kelamin"`
		Jumlah       int64  `json:"jumlah"`
	}
	type KelasCount struct {
		Tingkat string `json:"tingkat"`
		Jumlah  int64  `json:"jumlah"`
	}

	var totalSiswa int64
	h.db.Table("siswa").Where("deleted_at IS NULL").Count(&totalSiswa)

	var totalKelas int64
	h.db.Table("kelas").Count(&totalKelas)

	var totalMapel int64
	h.db.Table("mata_pelajaran").Where("aktif = 1").Count(&totalMapel)

	var genderStats []GenderCount
	h.db.Raw(`
		SELECT jenis_kelamin, COUNT(*) as jumlah 
		FROM siswa WHERE deleted_at IS NULL 
		GROUP BY jenis_kelamin
	`).Scan(&genderStats)

	var kelasStats []KelasCount
	h.db.Raw(`
		SELECT k.tingkat, COUNT(s.id) as jumlah
		FROM kelas k
		LEFT JOIN siswa s ON s.kelas_id = k.id AND s.deleted_at IS NULL
		GROUP BY k.tingkat
		ORDER BY k.tingkat
	`).Scan(&kelasStats)

	// Get per-kelas detail
	type KelasDetail struct {
		ID       uint   `json:"id"`
		Nama     string `json:"nama"`
		Tingkat  string `json:"tingkat"`
		Jurusan  string `json:"jurusan"`
		Jumlah   int64  `json:"jumlah"`
	}
	var kelasDetail []KelasDetail
	h.db.Raw(`
		SELECT k.id, k.nama, k.tingkat, k.jurusan, COUNT(s.id) as jumlah
		FROM kelas k
		LEFT JOIN siswa s ON s.kelas_id = k.id AND s.deleted_at IS NULL
		GROUP BY k.id, k.nama, k.tingkat, k.jurusan
		ORDER BY k.tingkat, k.jurusan
	`).Scan(&kelasDetail)

	stats := gin.H{
		"total_siswa":  totalSiswa,
		"total_kelas":  totalKelas,
		"total_mapel":  totalMapel,
		"gender_stats": genderStats,
		"kelas_stats":  kelasStats,
		"kelas_detail": kelasDetail,
	}

	utils.SuccessResponse(c, "Dashboard stats retrieved", stats)
}

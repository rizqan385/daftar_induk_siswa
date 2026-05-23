package database

import (
	"log"

	"daftar_induk_siswa/models"
	"daftar_induk_siswa/utils"

	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	if err := db.AutoMigrate(
		&models.User{},
		&models.Kelas{},
		&models.Siswa{},
		&models.AlamatSiswa{},
		&models.OrangTua{},
		&models.Wali{},
		&models.KesehatanSiswa{},
		&models.RiwayatPenyakit{},
		&models.PendidikanSebelumnya{},
		&models.Kepribadian{},
		&models.Prestasi{},
		&models.Beasiswa{},
		&models.MataPelajaran{},
		&models.NilaiSemester{},
		&models.Kehadiran{},
		&models.CatatanAkhirSemester{},
		&models.NilaiSikap{},
		&models.NilaiIjazah{},
		&models.MeninggalkanSekolah{},
		&models.PraktikKerjaLapangan{},
		&models.Ekstrakurikuler{},
		&models.PrestasiSemester{},
		&models.PemeriksaanBuku{},
		&models.ActivityLog{},
		&models.KeanggotaanEkskul{},
		&models.KetidakhadiranCatatan{},
	); err != nil {
		log.Printf("Warning: Failed to auto-migrate models: %v", err)
	}

	seedUsers(db)
}

func seedUsers(db *gorm.DB) {
	log.Println("Seeding/Updating default admin user...")
	password, err := utils.HashPassword("admin123")
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		return
	}

	var admin models.User
	result := db.Where("username = ?", "admin").First(&admin)

	switch result.Error {
	case gorm.ErrRecordNotFound:
		// Create new
		admin = models.User{
			Username:     "admin",
			Email:        "admin@siswa.local",
			PasswordHash: password,
			IsActive:     true,
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to create admin user: %v", err)
		} else {
			log.Println("Default admin user created: admin / admin123")
		}
	case nil:
		// Update existing
		admin.PasswordHash = password
		admin.IsActive = true // Ensure active
		if err := db.Save(&admin).Error; err != nil {
			log.Printf("Failed to update admin user: %v", err)
		} else {
			log.Println("Default admin user updated: admin / admin123")
		}
	default:
		log.Printf("Failed to check admin user: %v", result.Error)
	}
}

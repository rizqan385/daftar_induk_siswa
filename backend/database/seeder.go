package database

import (
	"log"

	"daftar_induk_siswa/models"
	"daftar_induk_siswa/utils"
	"gorm.io/gorm"
)

// Seed populates the database with initial data
func Seed(db *gorm.DB) {
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

	if result.Error == gorm.ErrRecordNotFound {
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
	} else if result.Error == nil {
		// Update existing
		admin.PasswordHash = password
		admin.IsActive = true // Ensure active
		if err := db.Save(&admin).Error; err != nil {
			log.Printf("Failed to update admin user: %v", err)
		} else {
			log.Println("Default admin user updated: admin / admin123")
		}
	} else {
		log.Printf("Failed to check admin user: %v", result.Error)
	}
}

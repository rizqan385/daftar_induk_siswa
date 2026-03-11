package main

import (
	"fmt"
	"daftar_induk_siswa/configs"
	"daftar_induk_siswa/database"
	"daftar_induk_siswa/models"
)

func main() {
	cfg := &configs.Config{
		Server: configs.ServerConfig{Mode: "development"},
		Database: configs.DatabaseConfig{
			Host: "127.0.0.1",
			Port: "3306",
			User: "root",
			Password: "",
			Name: "db_siswa_induk_api",
		},
	}
	db, err := database.Connect(cfg)
	if err != nil {
		fmt.Println("DB error:", err)
		return
	}

	mapel := models.MataPelajaran{
		Kode: "TEST-CMD",
		Nama: "Test CMD",
		Kelompok: "A",
		SubKelompok: "",
		KelasTarget1: "X TKJ",
		KelasTarget2: "XI TKJ",
		Aktif: true,
	}

	if err := db.Create(&mapel).Error; err != nil {
		fmt.Println("Create error:", err)
		return
	}

	fmt.Println("Created successfully with ID:", mapel.ID)

	var retrieved models.MataPelajaran
	db.First(&retrieved, mapel.ID)
	fmt.Printf("Retrieved Target 1: %s, Target 2: %s\n", retrieved.KelasTarget1, retrieved.KelasTarget2)
}

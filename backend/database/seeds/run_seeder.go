// run_seeder.go
// Jalanin dengan: go run ./database/seeds/run_seeder.go
// dari direktori backend/
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// Load .env
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: .env not found, using env vars")
	}

	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	user := getEnv("DB_USER", "qann")
	pass := getEnv("DB_PASSWORD", "pukimark")
	name := getEnv("DB_NAME", "db_siswa_induk_api")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&multiStatements=true",
		user, pass, host, port, name)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal konek DB: %v", err)
	}

	// Baca seeder.sql
	sqlPath := filepath.Join("database", "seeds", "seeder.sql")
	f, err := os.Open(sqlPath)
	if err != nil {
		log.Fatalf("Gagal buka seeder.sql: %v", err)
	}
	defer f.Close()

	var sb strings.Builder
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 1024*1024)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "--") {
			continue
		}
		sb.WriteString(line)
		sb.WriteString("\n")
	}

	sqlContent := sb.String()
	statements := strings.Split(sqlContent, ";\n")

	sqlDB, _ := db.DB()
	tx, err := sqlDB.Begin()
	if err != nil {
		log.Fatalf("Gagal begin transaction: %v", err)
	}

	count := 0
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if _, err := tx.Exec(stmt); err != nil {
			tx.Rollback()
			log.Fatalf("Error eksekusi SQL:\n%s\n\nError: %v", stmt[:min(len(stmt), 200)], err)
		}
		count++
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("Gagal commit: %v", err)
	}

	fmt.Printf("✅ Seeder berhasil! %d statement dieksekusi.\n", count)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

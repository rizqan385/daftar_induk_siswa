package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/configs"
	"daftar_induk_siswa/database"
	"daftar_induk_siswa/routes"
	"github.com/rs/zerolog"

	_ "daftar_induk_siswa/docs"
)

// @title API Siswa Induk
// @version 1.0
// @description API untuk Sistem Data Induk Siswa SMK
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@siswa.local

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Enter "Bearer {token}" to authenticate

func main() {
	// Load configuration
	cfg := configs.LoadConfig()

	// Setup zerolog
	zerolog.TimeFieldFormat = time.RFC3339

	// Set Gin mode
	if cfg.Server.Mode == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Connect to database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Seed database
	database.Seed(db)

	// Create Gin router
	r := gin.New()

	// Setup routes
	routes.SetupRoutes(r, db)

	// Create uploads directory
	if err := os.MkdirAll(cfg.Upload.Path+"/photos", 0755); err != nil {
		log.Printf("Warning: Could not create uploads directory: %v", err)
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Printf("Swagger docs available at http://localhost:%s/swagger/index.html", cfg.Server.Port)

	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

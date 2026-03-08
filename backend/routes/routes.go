package routes

import (
	"time"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/handlers"
	"daftar_induk_siswa/middlewares"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/services"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

// SetupRoutes configures all API routes
func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize rate limiter (100 requests per minute per IP)
	rateLimiter := middlewares.NewRateLimiter(100, time.Minute)

	// Global middlewares
	r.Use(middlewares.LoggerMiddleware())
	r.Use(middlewares.CORSMiddleware())
	r.Use(middlewares.SecurityHeadersMiddleware())
	r.Use(middlewares.RateLimitMiddleware(rateLimiter))
	r.Use(middlewares.RequestSizeLimitMiddleware(10 << 20)) // 10MB max request size
	r.Use(gzip.Gzip(gzip.DefaultCompression))               // Gzip compression
	r.Use(gin.Recovery())

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	siswaRepo := repositories.NewSiswaRepository(db)
	alamatRepo := repositories.NewAlamatRepository(db)
	orangTuaRepo := repositories.NewOrangTuaRepository(db)
	waliRepo := repositories.NewWaliRepository(db)
	kesehatanRepo := repositories.NewKesehatanRepository(db)
	mapelRepo := repositories.NewMataPelajaranRepository(db)
	nilaiRepo := repositories.NewNilaiSemesterRepository(db)
	sikapRepo := repositories.NewNilaiSikapRepository(db)
	catatanRepo := repositories.NewCatatanRepository(db)
	ijazahRepo := repositories.NewNilaiIjazahRepository(db)
	kehadiranRepo := repositories.NewKehadiranRepository(db)
	pendidikanRepo := repositories.NewPendidikanRepository(db)
	kepribadianRepo := repositories.NewKepribadianRepository(db)
	prestasiRepo := repositories.NewPrestasiRepository(db)
	beasiswaRepo := repositories.NewBeasiswaRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo)
	siswaService := services.NewSiswaService(siswaRepo, alamatRepo, orangTuaRepo, waliRepo, kesehatanRepo)
	nilaiService := services.NewNilaiService(siswaRepo, mapelRepo, nilaiRepo, sikapRepo, catatanRepo, ijazahRepo, kehadiranRepo)
	orangTuaService := services.NewOrangTuaService(siswaRepo, orangTuaRepo)
	waliService := services.NewWaliService(siswaRepo, waliRepo)
	kesehatanService := services.NewKesehatanService(siswaRepo, kesehatanRepo)
	pendidikanService := services.NewPendidikanService(siswaRepo, pendidikanRepo)
	kepribadianService := services.NewKepribadianService(siswaRepo, kepribadianRepo)
	prestasiService := services.NewPrestasiService(siswaRepo, prestasiRepo)
	beasiswaService := services.NewBeasiswaService(siswaRepo, beasiswaRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	siswaHandler := handlers.NewSiswaHandler(siswaService)
	nilaiHandler := handlers.NewNilaiHandler(nilaiService)
	orangTuaHandler := handlers.NewOrangTuaHandler(orangTuaService)
	waliHandler := handlers.NewWaliHandler(waliService)
	kesehatanHandler := handlers.NewKesehatanHandler(kesehatanService)
	pendidikanHandler := handlers.NewPendidikanHandler(pendidikanService)
	kepribadianHandler := handlers.NewKepribadianHandler(kepribadianService)
	prestasiHandler := handlers.NewPrestasiHandler(prestasiService)
	beasiswaHandler := handlers.NewBeasiswaHandler(beasiswaService)

	// API v1 routes
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"success": true, "message": "healthy", "data": gin.H{"version": "1.0.0"}})
		})

		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middlewares.AuthMiddleware())
		{
			// Auth routes (protected)
			authProtected := protected.Group("/auth")
			{
				authProtected.POST("/register", authHandler.Register)
				authProtected.GET("/profile", authHandler.GetProfile)
			}

			// Siswa routes
			siswa := protected.Group("/siswa")
			{
				siswa.POST("", siswaHandler.Create)
				siswa.GET("", siswaHandler.FindAll)
				siswa.GET("/:id", siswaHandler.FindByID)
				siswa.PUT("/:id", siswaHandler.Update)
				siswa.DELETE("/:id", siswaHandler.Delete)
				siswa.POST("/:id/foto", siswaHandler.UploadFoto)

				// Sub-resources routes
				siswa.POST("/:id/orang-tua", orangTuaHandler.Create)
				siswa.POST("/:id/wali", waliHandler.CreateOrUpdate)
				siswa.POST("/:id/kesehatan", kesehatanHandler.CreateOrUpdate)
				siswa.POST("/:id/pendidikan", pendidikanHandler.Add)

				// Nested routes for nilai & kehadiran (using same :id parameter)
				siswa.POST("/:id/nilai-semester", nilaiHandler.CreateNilaiSemester)
				siswa.POST("/:id/nilai-semester/batch", nilaiHandler.BatchCreateNilaiSemester)
				siswa.GET("/:id/nilai-semester", nilaiHandler.GetNilaiSemester)

				// Kehadiran routes
				siswa.GET("/:id/kehadiran", nilaiHandler.GetKehadiran)

				siswa.POST("/:id/nilai-ijazah", nilaiHandler.CreateNilaiIjazah)
				siswa.GET("/:id/nilai-ijazah", nilaiHandler.GetNilaiIjazah)

				siswa.POST("/:id/catatan-semester", nilaiHandler.CreateCatatanSemester)
				siswa.GET("/:id/catatan-semester", nilaiHandler.GetCatatanSemester)

				// Additional Data Routes
				siswa.POST("/:id/kepribadian", kepribadianHandler.Add)
				siswa.POST("/:id/prestasi", prestasiHandler.Add)
				siswa.POST("/:id/beasiswa", beasiswaHandler.Add)

				// Meninggalkan Sekolah
				siswa.POST("/:id/meninggalkan-sekolah", siswaHandler.AddMeninggalkanSekolah)
			}

			// Direct resource routes for updates/deletes
			protected.PUT("/orang-tua/:id", orangTuaHandler.Update)
			protected.DELETE("/orang-tua/:id", orangTuaHandler.Delete)

			protected.POST("/kesehatan/:id/riwayat-penyakit", kesehatanHandler.AddRiwayatPenyakit)
			protected.DELETE("/riwayat-penyakit/:id", kesehatanHandler.DeleteRiwayatPenyakit)

			protected.PUT("/pendidikan/:id", pendidikanHandler.Update)
			protected.DELETE("/pendidikan/:id", pendidikanHandler.Delete)

			protected.DELETE("/kepribadian/:id", kepribadianHandler.Delete)
			protected.DELETE("/prestasi/:id", prestasiHandler.Delete)
			protected.DELETE("/beasiswa/:id", beasiswaHandler.Delete)

			// Mata pelajaran routes
			protected.GET("/mata-pelajaran", nilaiHandler.GetMataPelajaran)

			// Catatan semester routes (separate group)
			catatanSemester := protected.Group("/catatan-semester")
			{
				catatanSemester.POST("/:id/pkl", nilaiHandler.AddPKL)
				catatanSemester.POST("/:id/ekstrakurikuler", nilaiHandler.AddEkstrakurikuler)
			}
		}
	}

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Serve uploaded files
	r.Static("/uploads", "./uploads")
}

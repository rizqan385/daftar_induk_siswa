package routes

import (
	"strconv"
	"time"

	"daftar_induk_siswa/handlers"
	"daftar_induk_siswa/middlewares"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
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
	activityLogRepo := repositories.NewActivityLogRepository(db)
	kelasRepo := repositories.NewKelasRepository(db)
	keanggotaanEkskulRepo := repositories.NewKeanggotaanEkskulRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo)
	siswaService := services.NewSiswaService(siswaRepo, alamatRepo, orangTuaRepo, waliRepo, kesehatanRepo, kelasRepo)
	nilaiService := services.NewNilaiService(siswaRepo, mapelRepo, nilaiRepo, sikapRepo, catatanRepo, ijazahRepo, kehadiranRepo)
	orangTuaService := services.NewOrangTuaService(siswaRepo, orangTuaRepo)
	waliService := services.NewWaliService(siswaRepo, waliRepo)
	kesehatanService := services.NewKesehatanService(siswaRepo, kesehatanRepo)
	pendidikanService := services.NewPendidikanService(siswaRepo, pendidikanRepo)
	kepribadianService := services.NewKepribadianService(siswaRepo, kepribadianRepo)
	prestasiService := services.NewPrestasiService(siswaRepo, prestasiRepo)
	beasiswaService := services.NewBeasiswaService(siswaRepo, beasiswaRepo)
	activityLogService := services.NewActivityLogService(activityLogRepo)
	kelasService := services.NewKelasService(kelasRepo)
	keanggotaanEkskulService := services.NewKeanggotaanEkskulService(keanggotaanEkskulRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	siswaHandler := handlers.NewSiswaHandler(siswaService, activityLogService)
	nilaiHandler := handlers.NewNilaiHandler(nilaiService)
	orangTuaHandler := handlers.NewOrangTuaHandler(orangTuaService)
	waliHandler := handlers.NewWaliHandler(waliService)
	kesehatanHandler := handlers.NewKesehatanHandler(kesehatanService)
	pendidikanHandler := handlers.NewPendidikanHandler(pendidikanService)
	kepribadianHandler := handlers.NewKepribadianHandler(kepribadianService)
	prestasiHandler := handlers.NewPrestasiHandler(prestasiService)
	beasiswaHandler := handlers.NewBeasiswaHandler(beasiswaService)
	alamatHandler := handlers.NewAlamatHandler(alamatRepo)
	activityLogHandler := handlers.NewActivityLogHandler(activityLogService)
	kelasHandler := handlers.NewKelasHandler(kelasService)
	keanggotaanEkskulHandler := handlers.NewKeanggotaanEkskulHandler(keanggotaanEkskulService, activityLogService)
	dashboardHandler := handlers.NewDashboardHandler(db)

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
			// Dashboard
			protected.GET("/dashboard/stats", dashboardHandler.GetStats)

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
				siswa.POST("/import", siswaHandler.ImportExcel)
				siswa.GET("", siswaHandler.FindAll)
				siswa.GET("/:id", siswaHandler.FindByID)
				siswa.PUT("/:id", siswaHandler.Update)
				siswa.DELETE("/:id", siswaHandler.Delete)
				siswa.POST("/:id/foto", siswaHandler.UploadFoto)

				// Sub-resources routes
				siswa.POST("/:id/alamat", alamatHandler.CreateOrUpdate)
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
				siswa.POST("/:id/kehadiran", nilaiHandler.CreateKehadiran)

				siswa.POST("/:id/nilai-ijazah", nilaiHandler.CreateNilaiIjazah)
				siswa.GET("/:id/nilai-ijazah", nilaiHandler.GetNilaiIjazah)

				siswa.POST("/:id/nilai-sikap", nilaiHandler.CreateNilaiSikap)

				siswa.POST("/:id/catatan-semester", nilaiHandler.CreateCatatanSemester)
				siswa.GET("/:id/catatan-semester", nilaiHandler.GetCatatanSemester)

				// Additional Data Routes
				siswa.POST("/:id/kepribadian", kepribadianHandler.Add)
				siswa.POST("/:id/prestasi", prestasiHandler.Add)
				siswa.POST("/:id/beasiswa", beasiswaHandler.Add)

				// Meninggalkan Sekolah
				siswa.POST("/:id/meninggalkan-sekolah", siswaHandler.AddMeninggalkanSekolah)
				siswa.DELETE("/:id/meninggalkan-sekolah", siswaHandler.DeleteMeninggalkanSekolah)
			}

			// Direct resource routes for updates/deletes
			protected.PUT("/orang-tua/:id", orangTuaHandler.Update)
			protected.DELETE("/orang-tua/:id", orangTuaHandler.Delete)

			protected.POST("/kesehatan/:id/riwayat-penyakit", kesehatanHandler.AddRiwayatPenyakit)
			protected.DELETE("/riwayat-penyakit/:id", kesehatanHandler.DeleteRiwayatPenyakit)

			protected.PUT("/pendidikan/:id", pendidikanHandler.Update)
			protected.DELETE("/pendidikan/:id", pendidikanHandler.Delete)

			protected.PUT("/kepribadian/:id", kepribadianHandler.Update)
			protected.DELETE("/kepribadian/:id", kepribadianHandler.Delete)
			protected.PUT("/prestasi/:id", prestasiHandler.Update)
			protected.DELETE("/prestasi/:id", prestasiHandler.Delete)
			protected.PUT("/beasiswa/:id", beasiswaHandler.Update)
			protected.DELETE("/beasiswa/:id", beasiswaHandler.Delete)

			protected.PUT("/pkl/:id", nilaiHandler.UpdatePKL)
			protected.DELETE("/pkl/:id", nilaiHandler.DeletePKL)
			protected.PUT("/ekstrakurikuler/:id", nilaiHandler.UpdateEkstrakurikuler)
			protected.DELETE("/ekstrakurikuler/:id", nilaiHandler.DeleteEkstrakurikuler)

			// Nilai semester update route
			protected.PUT("/nilai-semester/:id", nilaiHandler.UpdateNilaiSemester)
			protected.DELETE("/nilai-semester/:id", func(c *gin.Context) {
				id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
				if err := nilaiRepo.Delete(uint(id)); err != nil {
					utils.BadRequestResponse(c, err.Error(), nil)
					return
				}
				utils.SuccessResponse(c, "Grade deleted", nil)
			})

			// Mata pelajaran routes
			protected.GET("/mata-pelajaran", nilaiHandler.GetMataPelajaran)
			protected.POST("/mata-pelajaran", func(c *gin.Context) {
				var mapel models.MataPelajaran
				if err := c.ShouldBindJSON(&mapel); err != nil {
					utils.BadRequestResponse(c, "Invalid request", err.Error())
					return
				}
				if err := db.Create(&mapel).Error; err != nil {
					utils.BadRequestResponse(c, err.Error(), nil)
					return
				}
				utils.CreatedResponse(c, "Mata pelajaran created", mapel)
			})
			protected.PUT("/mata-pelajaran/:id", func(c *gin.Context) {
				id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
				var mapel models.MataPelajaran
				if err := db.First(&mapel, uint(id)).Error; err != nil {
					utils.BadRequestResponse(c, "Mata pelajaran not found", nil)
					return
				}
				if err := c.ShouldBindJSON(&mapel); err != nil {
					utils.BadRequestResponse(c, "Invalid request", err.Error())
					return
				}
				mapel.ID = uint(id)
				db.Save(&mapel)
				utils.SuccessResponse(c, "Mata pelajaran updated", mapel)
			})
			protected.DELETE("/mata-pelajaran/:id", func(c *gin.Context) {
				id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
				db.Delete(&models.MataPelajaran{}, uint(id))
				utils.SuccessResponse(c, "Mata pelajaran deleted", nil)
			})

			// Kelas CRUD
			kelas := protected.Group("/kelas")
			{
				kelas.GET("", kelasHandler.FindAll)
				kelas.GET("/:id", kelasHandler.FindByID)
				kelas.POST("", kelasHandler.Create)
				kelas.PUT("/:id", kelasHandler.Update)
				kelas.DELETE("/:id", kelasHandler.Delete)
			}

			// Activity log routes
			protected.GET("/activity-logs", activityLogHandler.GetLogs)

			// Catatan semester routes (separate group)
			catatanSemester := protected.Group("/catatan-semester")
			{
				catatanSemester.POST("/:id/pkl", nilaiHandler.AddPKL)
				catatanSemester.POST("/:id/ekstrakurikuler", nilaiHandler.AddEkstrakurikuler)
				catatanSemester.PUT("/:id", nilaiHandler.UpdateCatatanSemester)
			}

			// Keanggotaan Ekskul routes
			keanggotaanEkskul := protected.Group("/keanggotaan-ekskul")
			{
				keanggotaanEkskul.POST("", keanggotaanEkskulHandler.Add)
				keanggotaanEkskul.GET("", keanggotaanEkskulHandler.GetAll)
				keanggotaanEkskul.PUT("/:id", keanggotaanEkskulHandler.Update)
				keanggotaanEkskul.DELETE("/:id", keanggotaanEkskulHandler.Delete)
			}
		}
	}

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Serve uploaded files
	r.Static("/uploads", "./uploads")
}

package routes

import (
	"time"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/kampunk/backend/handlers"
	"github.com/kampunk/backend/middlewares"
	"github.com/kampunk/backend/repositories"
	"github.com/kampunk/backend/services"
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

	// Initialize services
	authService := services.NewAuthService(userRepo)
	siswaService := services.NewSiswaService(siswaRepo, alamatRepo, orangTuaRepo, waliRepo, kesehatanRepo)


	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	siswaHandler := handlers.NewSiswaHandler(siswaService)


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

			}
		}
	}

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Serve uploaded files
	r.Static("/uploads", "./uploads")
}

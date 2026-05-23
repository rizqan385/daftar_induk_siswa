package database

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"time"

	"daftar_induk_siswa/configs"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// buildDSN constructs MySQL DSN, supporting Railway's MYSQL_URL / DATABASE_URL
func buildDSN(cfg *configs.Config) string {
	// Cek MYSQL_URL atau DATABASE_URL dari Railway
	for _, key := range []string{"MYSQL_URL", "DATABASE_URL", "MYSQL_PRIVATE_URL"} {
		if rawURL := os.Getenv(key); rawURL != "" {
			log.Printf("Using connection URL from %s", key)
			// Parse mysql://user:pass@host:port/dbname → GORM DSN
			u, err := url.Parse(rawURL)
			if err != nil {
				log.Printf("Warning: failed to parse %s: %v, falling back", key, err)
				continue
			}
			password, _ := u.User.Password()
			dsn := fmt.Sprintf("%s:%s@tcp(%s)%s?charset=utf8mb4&parseTime=True&loc=Local",
				u.User.Username(),
				password,
				u.Host,
				u.Path,
			)
			return dsn
		}
	}
	// Fallback ke individual env vars
	log.Printf("Using DB_HOST=%s DB_PORT=%s DB_NAME=%s", cfg.Database.Host, cfg.Database.Port, cfg.Database.Name)
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Name,
	)
}

// Connect initializes database connection
func Connect(cfg *configs.Config) (*gorm.DB, error) {
	dsn := buildDSN(cfg)

	// Configure logger based on mode
	var logLevel logger.LogLevel
	if cfg.Server.Mode == "development" {
		logLevel = logger.Info
	} else {
		logLevel = logger.Silent
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL DB for connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Test connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Database connected successfully")
	DB = db
	return db, nil
}

// Close closes the database connection
func Close() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}

package configs

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Upload   UploadConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port string
	Mode string
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret      string
	ExpiryHours int
}

// UploadConfig holds file upload configuration
type UploadConfig struct {
	Path    string
	MaxSize int64
}

var AppConfig *Config

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	// Load .env file only in non-production (local dev)
	// Di Railway/production, env vars sudah di-inject langsung — jangan di-override .env lokal
	if os.Getenv("SERVER_MODE") != "production" && os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found, using environment variables")
		}
	} else {
		log.Println("Production mode: skipping .env file, using injected environment variables")
	}

	expiryHours, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	maxFileSize, _ := strconv.ParseInt(getEnv("MAX_FILE_SIZE", "5242880"), 10, 64)

	AppConfig = &Config{
		Server: ServerConfig{
			Port: getEnvWithFallbacks([]string{"PORT", "SERVER_PORT"}, "8080"),
			Mode: getEnv("SERVER_MODE", "development"),
		},
		Database: DatabaseConfig{
			Host:     getEnvWithFallbacks([]string{"DB_HOST", "MYSQLHOST", "MYSQL_HOST"}, "localhost"),
			Port:     getEnvWithFallbacks([]string{"DB_PORT", "MYSQLPORT", "MYSQL_PORT"}, "3306"),
			User:     getEnvWithFallbacks([]string{"DB_USER", "MYSQLUSER", "MYSQL_USER"}, "root"),
			Password: getEnvWithFallbacks([]string{"DB_PASSWORD", "MYSQLPASSWORD", "MYSQL_PASSWORD"}, ""),
			Name:     getEnvWithFallbacks([]string{"DB_NAME", "MYSQLDATABASE", "MYSQL_DATABASE"}, "db_siswa_induk_api"),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "default-secret-change-this"),
			ExpiryHours: expiryHours,
		},
		Upload: UploadConfig{
			Path:    getEnv("UPLOAD_PATH", "./uploads"),
			MaxSize: maxFileSize,
		},
	}

	return AppConfig
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// getEnvWithFallbacks tries multiple keys and returns the first found value
func getEnvWithFallbacks(keys []string, fallback string) string {
	for _, key := range keys {
		if value, exists := os.LookupEnv(key); exists && value != "" {
			return value
		}
	}
	return fallback
}

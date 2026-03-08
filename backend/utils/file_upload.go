package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"daftar_induk_siswa/configs"
)

// AllowedImageTypes lists allowed image MIME types
var AllowedImageTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/gif":  true,
	"image/webp": true,
}

// SaveUploadedFile saves an uploaded file to the specified directory
func SaveUploadedFile(file *multipart.FileHeader, subDir string) (string, error) {
	cfg := configs.AppConfig

	// Check file size
	if file.Size > cfg.Upload.MaxSize {
		return "", fmt.Errorf("file size exceeds maximum allowed size of %d bytes", cfg.Upload.MaxSize)
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// Create destination directory if it doesn't exist
	destDir := filepath.Join(cfg.Upload.Path, subDir)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), generateRandomString(8), ext)
	destPath := filepath.Join(destDir, filename)

	// Create destination file
	dst, err := os.Create(destPath)
	if err != nil {
		return "", fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dst.Close()

	// Copy file content
	if _, err := io.Copy(dst, src); err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	// Return relative path from upload directory
	return filepath.Join(subDir, filename), nil
}

// ValidateImageFile validates if the file is a valid image
func ValidateImageFile(file *multipart.FileHeader) error {
	// Check content type
	contentType := file.Header.Get("Content-Type")
	if !AllowedImageTypes[contentType] {
		return fmt.Errorf("invalid file type: %s. Allowed types: JPEG, PNG, GIF, WebP", contentType)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
	}
	if !allowedExtensions[ext] {
		return fmt.Errorf("invalid file extension: %s", ext)
	}

	return nil
}

// DeleteFile deletes a file from the upload directory
func DeleteFile(relativePath string) error {
	cfg := configs.AppConfig
	fullPath := filepath.Join(cfg.Upload.Path, relativePath)

	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return nil // File doesn't exist, nothing to delete
	}

	return os.Remove(fullPath)
}

// generateRandomString generates a random alphanumeric string
func generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[time.Now().UnixNano()%int64(len(charset))]
		time.Sleep(1 * time.Nanosecond)
	}
	return string(result)
}

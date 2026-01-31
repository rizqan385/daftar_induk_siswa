package utils

import (
	"html"
	"regexp"
	"strings"
)

// SanitizeString removes potentially dangerous characters and HTML tags
func SanitizeString(input string) string {
	// Escape HTML entities
	sanitized := html.EscapeString(input)

	// Remove any potential script tags (extra safety)
	scriptRegex := regexp.MustCompile(`(?i)<script[^>]*>.*?</script>`)
	sanitized = scriptRegex.ReplaceAllString(sanitized, "")

	// Trim whitespace
	sanitized = strings.TrimSpace(sanitized)

	return sanitized
}

// SanitizeHTML removes all HTML tags but keeps the text
func SanitizeHTML(input string) string {
	// Remove all HTML tags
	tagRegex := regexp.MustCompile(`<[^>]*>`)
	sanitized := tagRegex.ReplaceAllString(input, "")

	// Escape remaining HTML entities
	sanitized = html.EscapeString(sanitized)

	return strings.TrimSpace(sanitized)
}

// ValidateNISN validates NISN format (10 digits)
func ValidateNISN(nisn string) bool {
	matched, _ := regexp.MatchString(`^\d{10}$`, nisn)
	return matched
}

// ValidateNoInduk validates school registration number format
func ValidateNoInduk(noInduk string) bool {
	// Alphanumeric with optional dash/slash
	matched, _ := regexp.MatchString(`^[A-Za-z0-9\-\/]+$`, noInduk)
	return matched && len(noInduk) >= 5 && len(noInduk) <= 20
}

// ValidateEmail validates email format
func ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// ValidatePhone validates phone number format (Indonesian)
func ValidatePhone(phone string) bool {
	// Remove common separators
	cleaned := regexp.MustCompile(`[\s\-\(\)]`).ReplaceAllString(phone, "")
	// Check if it's a valid Indonesian phone number
	matched, _ := regexp.MatchString(`^(\+62|62|0)[0-9]{8,12}$`, cleaned)
	return matched
}

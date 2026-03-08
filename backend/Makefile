.PHONY: build run test clean swagger deps migrate

# Build the application
build:
	go build -o bin/api-siswa cmd/server/main.go

# Run the application
run:
	go run cmd/server/main.go

# Run with hot reload (requires air)
dev:
	air

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Clean build artifacts
clean:
	rm -rf bin/
	rm -f coverage.out coverage.html

# Generate Swagger documentation
swagger:
	swag init -g cmd/server/main.go -o docs

# Download dependencies
deps:
	go mod download
	go mod tidy

# Install development tools
tools:
	go install github.com/swaggo/swag/cmd/swag@latest
	go install github.com/cosmtrek/air@latest

# Format code
fmt:
	go fmt ./...

# Lint code (requires golangci-lint)
lint:
	golangci-lint run

# Run database migrations
migrate:
	@echo "Run: mysql -u root -p db_siswa_induk < database/migrations/001_schema.sql"

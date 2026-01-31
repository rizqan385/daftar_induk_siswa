package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/kampunk/backend/dtos/requests"
	"github.com/kampunk/backend/middlewares"
	"github.com/kampunk/backend/services"
	"github.com/kampunk/backend/utils"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService *services.AuthService
}

// NewAuthHandler creates a new AuthHandler
func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Login godoc
// @Summary Login admin
// @Description Authenticate admin user and get JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body requests.LoginRequest true "Login credentials"
// @Success 200 {object} utils.Response{data=responses.LoginResponse}
// @Failure 400 {object} utils.Response
// @Failure 401 {object} utils.Response
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req requests.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.authService.Login(req)
	if err != nil {
		utils.UnauthorizedResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Login successful", response)
}

// Register godoc
// @Summary Register new admin
// @Description Create a new admin user
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body requests.RegisterRequest true "Registration data"
// @Success 201 {object} utils.Response{data=responses.UserResponse}
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req requests.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.authService.Register(req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "User registered successfully", response)
}

// GetProfile godoc
// @Summary Get current user profile
// @Description Get the profile of the currently authenticated user
// @Tags Auth
// @Produce json
// @Success 200 {object} utils.Response{data=responses.UserResponse}
// @Failure 401 {object} utils.Response
// @Security BearerAuth
// @Router /auth/profile [get]
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := middlewares.GetUserIDFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	response, err := h.authService.GetProfile(userID)
	if err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	utils.SuccessResponse(c, "Profile retrieved", response)
}

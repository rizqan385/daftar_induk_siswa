package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// WaliHandler handles guardian endpoints
type WaliHandler struct {
	service *services.WaliService
}

func NewWaliHandler(service *services.WaliService) *WaliHandler {
	return &WaliHandler{service: service}
}

// CreateOrUpdate godoc
// @Summary Create or update guardian
// @Description Create or update guardian for a student
// @Tags Wali
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateWaliRequest true "Guardian data"
// @Success 200 {object} utils.Response{data=responses.WaliResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/wali [post]
func (h *WaliHandler) CreateOrUpdate(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateWaliRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.CreateOrUpdate(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Guardian data processed successfully", response)
}

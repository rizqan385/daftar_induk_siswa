package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// BeasiswaHandler handles scholarship endpoints
type BeasiswaHandler struct {
	service *services.BeasiswaService
}

func NewBeasiswaHandler(service *services.BeasiswaService) *BeasiswaHandler {
	return &BeasiswaHandler{service: service}
}

// Add godoc
// @Summary Add scholarship
// @Description Add scholarship record to student
// @Tags Beasiswa
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateBeasiswaRequest true "Scholarship data"
// @Success 201 {object} utils.Response{data=responses.BeasiswaResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/beasiswa [post]
func (h *BeasiswaHandler) Add(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateBeasiswaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Add(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Scholarship record added successfully", response)
}

// Delete godoc
// @Summary Delete scholarship
// @Description Delete scholarship record
// @Tags Beasiswa
// @Param id path int true "Scholarship Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /beasiswa/{id} [delete]
func (h *BeasiswaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid scholarship record ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

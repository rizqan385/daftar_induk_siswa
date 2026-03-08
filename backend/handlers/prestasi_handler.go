package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// PrestasiHandler handles achievement endpoints
type PrestasiHandler struct {
	service *services.PrestasiService
}

func NewPrestasiHandler(service *services.PrestasiService) *PrestasiHandler {
	return &PrestasiHandler{service: service}
}

// Add godoc
// @Summary Add achievement
// @Description Add achievement record to student
// @Tags Prestasi
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreatePrestasiRequest true "Achievement data"
// @Success 201 {object} utils.Response{data=responses.PrestasiResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/prestasi [post]
func (h *PrestasiHandler) Add(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreatePrestasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Add(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Achievement record added successfully", response)
}

// Delete godoc
// @Summary Delete achievement
// @Description Delete achievement record
// @Tags Prestasi
// @Param id path int true "Achievement Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /prestasi/{id} [delete]
func (h *PrestasiHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid achievement record ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

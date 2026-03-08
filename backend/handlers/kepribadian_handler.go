package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// KepribadianHandler handles personality endpoints
type KepribadianHandler struct {
	service *services.KepribadianService
}

func NewKepribadianHandler(service *services.KepribadianService) *KepribadianHandler {
	return &KepribadianHandler{service: service}
}

// Add godoc
// @Summary Add personality record
// @Description Add personality record to student
// @Tags Kepribadian
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateKepribadianRequest true "Personality data"
// @Success 201 {object} utils.Response{data=responses.KepribadianResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/kepribadian [post]
func (h *KepribadianHandler) Add(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateKepribadianRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Add(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Personality record added successfully", response)
}

// Delete godoc
// @Summary Delete personality record
// @Description Delete personality record
// @Tags Kepribadian
// @Param id path int true "Personality Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /kepribadian/{id} [delete]
func (h *KepribadianHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid personality record ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

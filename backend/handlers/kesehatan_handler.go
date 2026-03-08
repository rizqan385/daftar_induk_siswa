package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// KesehatanHandler handles health endpoints
type KesehatanHandler struct {
	service *services.KesehatanService
}

func NewKesehatanHandler(service *services.KesehatanService) *KesehatanHandler {
	return &KesehatanHandler{service: service}
}

// CreateOrUpdate godoc
// @Summary Create or update health data
// @Description Create or update health data for a student
// @Tags Kesehatan
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateKesehatanRequest true "Health data"
// @Success 200 {object} utils.Response{data=responses.KesehatanResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/kesehatan [post]
func (h *KesehatanHandler) CreateOrUpdate(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateKesehatanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.CreateOrUpdate(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Health data processed successfully", response)
}

// AddRiwayatPenyakit godoc
// @Summary Add disease history
// @Description Add disease history record to health data
// @Tags Kesehatan
// @Accept json
// @Produce json
// @Param id path int true "Health ID (kesehatan_id)"
// @Param request body requests.CreateRiwayatPenyakitRequest true "Disease / condition data"
// @Success 201 {object} utils.Response{data=responses.RiwayatPenyakitResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /kesehatan/{id}/riwayat-penyakit [post]
func (h *KesehatanHandler) AddRiwayatPenyakit(c *gin.Context) {
	kesehatanID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid health ID", nil)
		return
	}

	var req requests.CreateRiwayatPenyakitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.AddRiwayatPenyakit(uint(kesehatanID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Disease history added successfully", response)
}

// DeleteRiwayatPenyakit godoc
// @Summary Delete disease history
// @Description Delete disease history record
// @Tags Kesehatan
// @Param id path int true "Disease History ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /riwayat-penyakit/{id} [delete]
func (h *KesehatanHandler) DeleteRiwayatPenyakit(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid disease history ID", nil)
		return
	}

	if err := h.service.DeleteRiwayatPenyakit(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

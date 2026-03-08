package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// PendidikanHandler handles education endpoints
type PendidikanHandler struct {
	service *services.PendidikanService
}

func NewPendidikanHandler(service *services.PendidikanService) *PendidikanHandler {
	return &PendidikanHandler{service: service}
}

// Add godoc
// @Summary Add previous education
// @Description Add previous education record to student
// @Tags Pendidikan
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreatePendidikanRequest true "Education data"
// @Success 201 {object} utils.Response{data=responses.PendidikanResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/pendidikan [post]
func (h *PendidikanHandler) Add(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreatePendidikanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Add(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Education record added successfully", response)
}

// Update godoc
// @Summary Update education
// @Description Update previous education record
// @Tags Pendidikan
// @Accept json
// @Produce json
// @Param id path int true "Education Record ID"
// @Param request body requests.UpdatePendidikanRequest true "Education data"
// @Success 200 {object} utils.Response{data=responses.PendidikanResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /pendidikan/{id} [put]
func (h *PendidikanHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid education record ID", nil)
		return
	}

	var req requests.UpdatePendidikanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Update(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Education record updated successfully", response)
}

// Delete godoc
// @Summary Delete education
// @Description Delete previous education record
// @Tags Pendidikan
// @Param id path int true "Education Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /pendidikan/{id} [delete]
func (h *PendidikanHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid education record ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

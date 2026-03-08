package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// OrangTuaHandler handles parent endpoints
type OrangTuaHandler struct {
	service *services.OrangTuaService
}

func NewOrangTuaHandler(service *services.OrangTuaService) *OrangTuaHandler {
	return &OrangTuaHandler{service: service}
}

// Create godoc
// @Summary Create parent
// @Description Create parent for a student
// @Tags Orang Tua
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateOrangTuaRequest true "Parent data"
// @Success 201 {object} utils.Response{data=responses.OrangTuaResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/orang-tua [post]
func (h *OrangTuaHandler) Create(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateOrangTuaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Create(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Parent created successfully", response)
}

// Update godoc
// @Summary Update parent
// @Description Update parent data
// @Tags Orang Tua
// @Accept json
// @Produce json
// @Param id path int true "Parent ID"
// @Param request body requests.UpdateOrangTuaRequest true "Parent data"
// @Success 200 {object} utils.Response{data=responses.OrangTuaResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /orang-tua/{id} [put]
func (h *OrangTuaHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid parent ID", nil)
		return
	}

	var req requests.UpdateOrangTuaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Update(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Parent updated successfully", response)
}

// Delete godoc
// @Summary Delete parent
// @Description Delete parent data
// @Tags Orang Tua
// @Param id path int true "Parent ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /orang-tua/{id} [delete]
func (h *OrangTuaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid parent ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

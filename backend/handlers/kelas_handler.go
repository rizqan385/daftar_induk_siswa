package handlers

import (
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type KelasHandler struct {
	kelasService *services.KelasService
}

func NewKelasHandler(kelasService *services.KelasService) *KelasHandler {
	return &KelasHandler{kelasService: kelasService}
}

func (h *KelasHandler) FindAll(c *gin.Context) {
	kelasList, err := h.kelasService.FindAll()
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}
	utils.SuccessResponse(c, "Kelas retrieved", kelasList)
}

func (h *KelasHandler) FindByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}
	kelas, err := h.kelasService.FindByID(uint(id))
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}
	utils.SuccessResponse(c, "Kelas found", kelas)
}

func (h *KelasHandler) Create(c *gin.Context) {
	var kelas models.Kelas
	if err := c.ShouldBindJSON(&kelas); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}
	if err := h.kelasService.Create(&kelas); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}
	utils.CreatedResponse(c, "Kelas created", kelas)
}

func (h *KelasHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}
	var data models.Kelas
	if err := c.ShouldBindJSON(&data); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}
	kelas, err := h.kelasService.Update(uint(id), &data)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}
	utils.SuccessResponse(c, "Kelas updated", kelas)
}

func (h *KelasHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}
	if err := h.kelasService.Delete(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}
	utils.SuccessResponse(c, "Kelas deleted", nil)
}

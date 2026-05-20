package handlers

import (
	"fmt"

	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"

	"github.com/gin-gonic/gin"
)

// ImportRaportHandler handles raport excel import endpoints
type ImportRaportHandler struct {
	importService   *services.ImportRaportService
	activityService *services.ActivityLogService
}

// NewImportRaportHandler creates a new ImportRaportHandler
func NewImportRaportHandler(importService *services.ImportRaportService, activityService *services.ActivityLogService) *ImportRaportHandler {
	return &ImportRaportHandler{
		importService:   importService,
		activityService: activityService,
	}
}

// PreviewRaport godoc
// @Summary Preview raport Excel
// @Description Baca file raport Excel dan tampilkan preview data yang akan diimport (tanpa menyimpan ke DB)
// @Tags Import
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "File Excel raport (.xlsx)"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/preview-raport [post]
func (h *ImportRaportHandler) PreviewRaport(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.BadRequestResponse(c, "File tidak ditemukan", err.Error())
		return
	}

	preview, err := h.importService.PreviewRaport(file)
	if err != nil {
		utils.BadRequestResponse(c, "Gagal membaca file raport", err.Error())
		return
	}

	utils.SuccessResponse(c, "Preview raport berhasil dibaca", preview)
}

// ImportRaport godoc
// @Summary Import raport Excel ke database
// @Description Import seluruh data raport (siswa, nilai, catatan, kehadiran) dari file Excel
// @Tags Import
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "File Excel raport (.xlsx)"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/import-raport [post]
func (h *ImportRaportHandler) ImportRaport(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.BadRequestResponse(c, "File tidak ditemukan", err.Error())
		return
	}

	result, err := h.importService.ImportRaport(file)
	if err != nil {
		utils.BadRequestResponse(c, "Gagal mengimport raport", err.Error())
		return
	}

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "IMPORT", "raport", 0,
		fmt.Sprintf("Import raport Excel: %d siswa baru, %d nilai diupdate, %d catatan diupdate",
			result.ImportedSiswa, result.UpdatedNilai, result.UpdatedCatatan),
		c.ClientIP())

	utils.SuccessResponse(c, fmt.Sprintf("Import berhasil: %d siswa baru, %d nilai, %d catatan",
		result.ImportedSiswa, result.UpdatedNilai, result.UpdatedCatatan), result)
}

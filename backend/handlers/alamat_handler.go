package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"
)

// AlamatHandler handles address endpoints
type AlamatHandler struct {
	alamatRepo *repositories.AlamatRepository
}

func NewAlamatHandler(alamatRepo *repositories.AlamatRepository) *AlamatHandler {
	return &AlamatHandler{alamatRepo: alamatRepo}
}

// CreateOrUpdate creates or updates address for a student
func (h *AlamatHandler) CreateOrUpdate(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateAlamatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	// Check if alamat already exists for this siswa
	existing, err := h.alamatRepo.FindBySiswaID(uint(siswaID))
	if err == nil && existing != nil {
		// Update existing
		existing.AlamatLengkap = utils.SanitizeString(req.AlamatLengkap)
		existing.Kelurahan = utils.SanitizeString(req.Kelurahan)
		existing.Kecamatan = utils.SanitizeString(req.Kecamatan)
		existing.Kota = utils.SanitizeString(req.Kota)
		existing.Provinsi = utils.SanitizeString(req.Provinsi)
		existing.KodePos = utils.SanitizeString(req.KodePos)
		existing.NoTelepon = utils.SanitizeString(req.NoTelepon)
		existing.TinggalDengan = utils.SanitizeString(req.TinggalDengan)
		existing.JarakKeSekolah = req.JarakKeSekolah
		existing.Transportasi = utils.SanitizeString(req.Transportasi)

		if err := h.alamatRepo.Update(existing); err != nil {
			utils.InternalServerErrorResponse(c, err.Error())
			return
		}
		utils.SuccessResponse(c, "Address updated successfully", existing)
		return
	}

	// Create new
	alamat := &models.AlamatSiswa{
		SiswaID:        uint(siswaID),
		AlamatLengkap:  utils.SanitizeString(req.AlamatLengkap),
		Kelurahan:      utils.SanitizeString(req.Kelurahan),
		Kecamatan:      utils.SanitizeString(req.Kecamatan),
		Kota:           utils.SanitizeString(req.Kota),
		Provinsi:       utils.SanitizeString(req.Provinsi),
		KodePos:        utils.SanitizeString(req.KodePos),
		NoTelepon:      utils.SanitizeString(req.NoTelepon),
		TinggalDengan:  utils.SanitizeString(req.TinggalDengan),
		JarakKeSekolah: req.JarakKeSekolah,
		Transportasi:   utils.SanitizeString(req.Transportasi),
	}

	if err := h.alamatRepo.Create(alamat); err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.CreatedResponse(c, "Address created successfully", alamat)
}

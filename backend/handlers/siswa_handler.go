package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// SiswaHandler handles student endpoints
type SiswaHandler struct {
	siswaService *services.SiswaService
}

// NewSiswaHandler creates a new SiswaHandler
func NewSiswaHandler(siswaService *services.SiswaService) *SiswaHandler {
	return &SiswaHandler{siswaService: siswaService}
}

// Create godoc
// @Summary Create a new student
// @Description Create a new student record
// @Tags Siswa
// @Accept json
// @Produce json
// @Param request body requests.CreateSiswaRequest true "Student data"
// @Success 201 {object} utils.Response{data=responses.SiswaDetailResponse}
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /siswa [post]
func (h *SiswaHandler) Create(c *gin.Context) {
	var req requests.CreateSiswaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.siswaService.Create(req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Student created successfully", response)
}

// FindByID godoc
// @Summary Get student by ID
// @Description Get detailed student information by ID
// @Tags Siswa
// @Produce json
// @Param id path int true "Student ID"
// @Success 200 {object} utils.Response{data=responses.SiswaDetailResponse}
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id} [get]
func (h *SiswaHandler) FindByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	response, err := h.siswaService.FindByID(uint(id))
	if err != nil {
		utils.NotFoundResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Student retrieved", response)
}

// FindAll godoc
// @Summary Get all students
// @Description Get paginated list of students
// @Tags Siswa
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param search query string false "Search by name, NISN, or registration number"
// @Param sort_by query string false "Sort field"
// @Param sort_dir query string false "Sort direction (asc/desc)"
// @Success 200 {object} utils.PaginatedResponse{data=[]responses.SiswaListResponse}
// @Security BearerAuth
// @Router /siswa [get]
func (h *SiswaHandler) FindAll(c *gin.Context) {
	var req requests.PaginationRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid query parameters", err.Error())
		return
	}

	response, pagination, err := h.siswaService.FindAll(req)
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.PaginatedSuccessResponse(c, "Students retrieved", response, pagination)
}

// Update godoc
// @Summary Update student
// @Description Update student information
// @Tags Siswa
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.UpdateSiswaRequest true "Student data"
// @Success 200 {object} utils.Response{data=responses.SiswaDetailResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id} [put]
func (h *SiswaHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	var req requests.UpdateSiswaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.siswaService.Update(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Student updated successfully", response)
}

// Delete godoc
// @Summary Delete student
// @Description Soft delete a student
// @Tags Siswa
// @Produce json
// @Param id path int true "Student ID"
// @Success 200 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id} [delete]
func (h *SiswaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	if err := h.siswaService.Delete(uint(id)); err != nil {
		utils.NotFoundResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Student deleted successfully", nil)
}

// UploadFoto godoc
// @Summary Upload student photo
// @Description Upload a photo for a student
// @Tags Siswa
// @Accept multipart/form-data
// @Produce json
// @Param id path int true "Student ID"
// @Param foto formData file true "Photo file (JPEG, PNG, GIF, WebP)"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/foto [post]
func (h *SiswaHandler) UploadFoto(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	file, err := c.FormFile("foto")
	if err != nil {
		utils.BadRequestResponse(c, "No file uploaded", err.Error())
		return
	}

	fotoPath, err := h.siswaService.UploadFoto(uint(id), file)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Photo uploaded successfully", gin.H{"foto_path": fotoPath})
}

// AddMeninggalkanSekolah godoc
// @Summary Add leaving school record
// @Description Add record of student leaving school
// @Tags Siswa
// @Accept json
// @Produce json
// @Param id path int true "Student ID"
// @Param request body requests.CreateMeninggalkanSekolahRequest true "Leaving data"
// @Success 201 {object} utils.Response{data=responses.MeninggalkanSekolahResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/meninggalkan-sekolah [post]
func (h *SiswaHandler) AddMeninggalkanSekolah(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	var req requests.CreateMeninggalkanSekolahRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.siswaService.AddMeninggalkanSekolah(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Leaving record added successfully", response)
}

package handlers

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// SiswaHandler handles student endpoints
type SiswaHandler struct {
	siswaService    *services.SiswaService
	activityService *services.ActivityLogService
}

// NewSiswaHandler creates a new SiswaHandler
func NewSiswaHandler(siswaService *services.SiswaService, activityService *services.ActivityLogService) *SiswaHandler {
	return &SiswaHandler{siswaService: siswaService, activityService: activityService}
}

// helper to extract user info from JWT context
func getUserInfo(c *gin.Context) (uint, string) {
	userID, _ := c.Get("user_id")
	username, _ := c.Get("username")
	uid, ok := userID.(uint)
	if !ok {
		// try float64 (JSON numbers default)
		if f, ok := userID.(float64); ok {
			uid = uint(f)
		}
	}
	uname, _ := username.(string)
	return uid, uname
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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "CREATE", "siswa", response.ID,
		fmt.Sprintf("Menambah siswa baru: %s", response.NamaLengkap), c.ClientIP())

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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "VIEW", "siswa", uint(id),
		fmt.Sprintf("Melihat data siswa: %s", response.NamaLengkap), c.ClientIP())

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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "UPDATE", "siswa", uint(id),
		fmt.Sprintf("Mengubah data siswa: %s", response.NamaLengkap), c.ClientIP())

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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "DELETE", "siswa", uint(id),
		fmt.Sprintf("Menghapus data siswa ID: %d", id), c.ClientIP())

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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "UPLOAD", "foto", uint(id),
		fmt.Sprintf("Upload foto siswa ID: %d", id), c.ClientIP())

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

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "CREATE", "meninggalkan_sekolah", uint(id),
		fmt.Sprintf("Menambah record pindah/keluar sekolah siswa ID: %d", id), c.ClientIP())

	utils.CreatedResponse(c, "Leaving record added successfully", response)
}

// DeleteMeninggalkanSekolah godoc
// @Summary Delete leaving school record
// @Description Delete record of student leaving school
// @Tags Siswa
// @Produce json
// @Param id path int true "Student ID"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/meninggalkan-sekolah [delete]
func (h *SiswaHandler) DeleteMeninggalkanSekolah(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	if err := h.siswaService.DeleteMeninggalkanSekolah(uint(id)); err != nil {
		if err.Error() == "student not found" {
			utils.NotFoundResponse(c, "Student not found")
			return
		}
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "DELETE", "meninggalkan_sekolah", uint(id),
		fmt.Sprintf("Menghapus record pindah/keluar sekolah siswa ID: %d", id), c.ClientIP())

	utils.SuccessResponse(c, "Leaving school record deleted successfully", nil)
}

// ImportExcel godoc
// @Summary Import student data from Excel
// @Description Import basic student (nisn, nis, nama, gender, kelas) from an uploaded .xlsx file
// @Tags Siswa
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Excel file (.xlsx)"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/import [post]
func (h *SiswaHandler) ImportExcel(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.BadRequestResponse(c, "No file uploaded", err.Error())
		return
	}

	importedCount, err := h.siswaService.ImportExcel(file)
	if err != nil {
		utils.BadRequestResponse(c, "Failed to import excel file", err.Error())
		return
	}

	// Audit log
	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "IMPORT", "siswa", 0,
		fmt.Sprintf("Import data siswa via Excel: %d berhasil ditambahkan", importedCount), c.ClientIP())

	utils.SuccessResponse(c, fmt.Sprintf("%d students imported successfully", importedCount), gin.H{
		"imported_count": importedCount,
	})
}

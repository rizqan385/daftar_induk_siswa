package handlers

import (
	"strconv"

	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"

	"github.com/gin-gonic/gin"
)

// NilaiHandler handles grade endpoints
type NilaiHandler struct {
	nilaiService *services.NilaiService
}

// NewNilaiHandler creates a new NilaiHandler
func NewNilaiHandler(nilaiService *services.NilaiService) *NilaiHandler {
	return &NilaiHandler{nilaiService: nilaiService}
}

// GetMataPelajaran godoc
// @Summary Get all subjects
// @Description Get list of all active subjects
// @Tags Mata Pelajaran
// @Produce json
// @Success 200 {object} utils.Response{data=[]responses.MataPelajaranResponse}
// @Security BearerAuth
// @Router /mata-pelajaran [get]
func (h *NilaiHandler) GetMataPelajaran(c *gin.Context) {
	response, err := h.nilaiService.GetAllMataPelajaran()
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Subjects retrieved", response)
}

// CreateNilaiSemester godoc
// @Summary Create semester grade
// @Description Create a semester grade for a student
// @Tags Nilai
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.CreateNilaiSemesterRequest true "Grade data"
// @Success 201 {object} utils.Response{data=responses.NilaiSemesterResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/nilai-semester [post]
func (h *NilaiHandler) CreateNilaiSemester(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateNilaiSemesterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.CreateNilaiSemester(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Semester grade created successfully", response)
}

// BatchCreateNilaiSemester godoc
// @Summary Create multiple semester grades
// @Description Create multiple semester grades for a student
// @Tags Nilai
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.BatchNilaiSemesterRequest true "Batch grade data"
// @Success 201 {object} utils.Response{data=[]responses.NilaiSemesterResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/nilai-semester/batch [post]
func (h *NilaiHandler) BatchCreateNilaiSemester(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.BatchNilaiSemesterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.BatchCreateNilaiSemester(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Semester grades created successfully", response)
}

// UpdateNilaiSemester updates an existing semester grade by ID
func (h *NilaiHandler) UpdateNilaiSemester(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid grade ID", nil)
		return
	}

	var req requests.UpdateNilaiSemesterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.UpdateNilaiSemester(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Semester grade updated successfully", response)
}

// GetNilaiSemester godoc
// @Summary Get semester grades
// @Description Get semester grades for a student with filters and pagination
// @Tags Nilai
// @Produce json
// @Param id path int true "Student ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param kelas query string false "Class filter (X, XI, XII)"
// @Param semester query int false "Semester filter (1, 2)"
// @Param tahun_pelajaran query string false "Academic year filter"
// @Success 200 {object} utils.PaginatedResponse{data=[]responses.NilaiSemesterResponse}
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/nilai-semester [get]
func (h *NilaiHandler) GetNilaiSemester(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var filter requests.NilaiFilterRequest
	var pagination requests.PaginationRequest

	if err := c.ShouldBindQuery(&filter); err != nil {
		utils.BadRequestResponse(c, "Invalid filter parameters", err.Error())
		return
	}
	if err := c.ShouldBindQuery(&pagination); err != nil {
		utils.BadRequestResponse(c, "Invalid pagination parameters", err.Error())
		return
	}

	// Set defaults
	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if pagination.PageSize < 1 {
		pagination.PageSize = 20
	}

	response, pageInfo, err := h.nilaiService.GetNilaiSemesterPaginated(uint(siswaID), filter, pagination.Page, pagination.PageSize)
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.PaginatedSuccessResponse(c, "Semester grades retrieved", response, pageInfo)
}

// GetKehadiran godoc
// @Summary Get attendance
// @Description Get attendance records for a student with pagination
// @Tags Siswa
// @Produce json
// @Param id path int true "Student ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} utils.PaginatedResponse{data=[]responses.KehadiranResponse}
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{id}/kehadiran [get]
func (h *NilaiHandler) GetKehadiran(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var pagination requests.PaginationRequest
	if err := c.ShouldBindQuery(&pagination); err != nil {
		utils.BadRequestResponse(c, "Invalid pagination parameters", err.Error())
		return
	}

	// Set defaults
	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if pagination.PageSize < 1 {
		pagination.PageSize = 20
	}

	response, pageInfo, err := h.nilaiService.GetKehadiranPaginated(uint(siswaID), pagination.Page, pagination.PageSize)
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.PaginatedSuccessResponse(c, "Attendance records retrieved", response, pageInfo)
}

// CreateKehadiran godoc
// @Summary Create attendance
// @Description Create an attendance record for a student
// @Tags Nilai
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.CreateKehadiranRequest true "Attendance data"
// @Success 201 {object} utils.Response{data=responses.KehadiranResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/kehadiran [post]
func (h *NilaiHandler) CreateKehadiran(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateKehadiranRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.CreateKehadiran(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Attendance record created successfully", response)
}

// CreateNilaiSikap godoc
// @Summary Create attitude grade
// @Description Create an attitude grade for a student
// @Tags Nilai
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.CreateNilaiSikapRequest true "Attitude grade data"
// @Success 201 {object} utils.Response{data=responses.NilaiSikapResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/nilai-sikap [post]
func (h *NilaiHandler) CreateNilaiSikap(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateNilaiSikapRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.CreateNilaiSikap(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Attitude grade created successfully", response)
}

// CreateNilaiIjazah godoc
// @Summary Create certificate grade
// @Description Create a certificate grade for a student
// @Tags Nilai
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.CreateNilaiIjazahRequest true "Certificate grade data"
// @Success 201 {object} utils.Response{data=responses.NilaiIjazahResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/nilai-ijazah [post]
func (h *NilaiHandler) CreateNilaiIjazah(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateNilaiIjazahRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.CreateNilaiIjazah(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Certificate grade created successfully", response)
}

// GetNilaiIjazah godoc
// @Summary Get certificate grades
// @Description Get certificate grades for a student
// @Tags Nilai
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Success 200 {object} utils.Response{data=[]responses.NilaiIjazahResponse}
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/nilai-ijazah [get]
func (h *NilaiHandler) GetNilaiIjazah(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	response, err := h.nilaiService.GetNilaiIjazah(uint(siswaID))
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Certificate grades retrieved", response)
}

// CreateCatatanSemester godoc
// @Summary Create semester notes
// @Description Create semester notes for a student
// @Tags Catatan Semester
// @Accept json
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Param request body requests.CreateCatatanSemesterRequest true "Semester notes data"
// @Success 201 {object} utils.Response{data=responses.CatatanSemesterResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/catatan-semester [post]
func (h *NilaiHandler) CreateCatatanSemester(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	var req requests.CreateCatatanSemesterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.CreateCatatanSemester(uint(siswaID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Semester notes created successfully", response)
}

// UpdateCatatanSemester updates the wali kelas note for an existing CAS
func (h *NilaiHandler) UpdateCatatanSemester(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid semester notes ID", nil)
		return
	}

	var req requests.UpdateCatatanSemesterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.UpdateCatatanSemester(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Semester notes updated successfully", response)
}

// GetCatatanSemester godoc
// @Summary Get semester notes
// @Description Get semester notes for a student
// @Tags Catatan Semester
// @Produce json
// @Param siswa_id path int true "Student ID"
// @Success 200 {object} utils.Response{data=[]responses.CatatanSemesterResponse}
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /siswa/{siswa_id}/catatan-semester [get]
func (h *NilaiHandler) GetCatatanSemester(c *gin.Context) {
	siswaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid student ID", nil)
		return
	}

	response, err := h.nilaiService.GetCatatanSemester(uint(siswaID))
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Semester notes retrieved", response)
}

// AddPKL godoc
// @Summary Add PKL to semester notes
// @Description Add internship record to semester notes
// @Tags Catatan Semester
// @Accept json
// @Produce json
// @Param catatan_id path int true "Semester Notes ID"
// @Param request body requests.CreatePKLRequest true "PKL data"
// @Success 201 {object} utils.Response{data=responses.PKLResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /catatan-semester/{catatan_id}/pkl [post]
func (h *NilaiHandler) AddPKL(c *gin.Context) {
	catatanID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid semester notes ID", nil)
		return
	}

	var req requests.CreatePKLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.AddPKL(uint(catatanID), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "PKL added successfully", response)
}

// AddEkstrakurikuler godoc
// @Summary Add extracurricular activity
// @Description Add extracurricular activity to semester notes
// @Tags Catatan Semester
// @Accept json
// @Produce json
// @Param id path int true "Semester Notes ID"
// @Param request body requests.CreateEkstrakurikulerRequest true "Extracurricular data"
// @Success 201 {object} utils.Response{data=responses.EkstrakurikulerResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /catatan-semester/{id}/ekstrakurikuler [post]
func (h *NilaiHandler) AddEkstrakurikuler(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid semester notes ID", nil)
		return
	}

	var req requests.CreateEkstrakurikulerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.AddEkstrakurikuler(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.CreatedResponse(c, "Extracurricular added successfully", response)
}

// UpdatePKL godoc
// @Summary Update internship record
// @Description Update PKL record
// @Tags Catatan Semester
// @Accept json
// @Produce json
// @Param id path int true "PKL Record ID"
// @Param request body requests.CreatePKLRequest true "PKL data"
// @Success 200 {object} utils.Response{data=responses.PKLResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /pkl/{id} [put]
func (h *NilaiHandler) UpdatePKL(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid PKL record ID", nil)
		return
	}

	var req requests.CreatePKLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.UpdatePKL(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "PKL updated successfully", response)
}

// DeletePKL godoc
// @Summary Delete internship record
// @Description Delete PKL record
// @Tags Catatan Semester
// @Param id path int true "PKL Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /pkl/{id} [delete]
func (h *NilaiHandler) DeletePKL(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid PKL record ID", nil)
		return
	}

	if err := h.nilaiService.DeletePKL(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

// UpdateEkstrakurikuler godoc
// @Summary Update extracurricular activity
// @Description Update extracurricular activity record
// @Tags Catatan Semester
// @Accept json
// @Produce json
// @Param id path int true "Extracurricular Record ID"
// @Param request body requests.CreateEkstrakurikulerRequest true "Extracurricular data"
// @Success 200 {object} utils.Response{data=responses.EkstrakurikulerResponse}
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /ekstrakurikuler/{id} [put]
func (h *NilaiHandler) UpdateEkstrakurikuler(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid extracurricular record ID", nil)
		return
	}

	var req requests.CreateEkstrakurikulerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.nilaiService.UpdateEkstrakurikuler(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, "Extracurricular activity updated successfully", response)
}

// DeleteEkstrakurikuler godoc
// @Summary Delete extracurricular activity
// @Description Delete extracurricular activity record
// @Tags Catatan Semester
// @Param id path int true "Extracurricular Record ID"
// @Success 204
// @Failure 404 {object} utils.Response
// @Security BearerAuth
// @Router /ekstrakurikuler/{id} [delete]
func (h *NilaiHandler) DeleteEkstrakurikuler(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid extracurricular record ID", nil)
		return
	}

	if err := h.nilaiService.DeleteEkstrakurikuler(uint(id)); err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	utils.NoContentResponse(c)
}

package handlers

import (
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

type KeanggotaanEkskulHandler struct {
	service         *services.KeanggotaanEkskulService
	activityService *services.ActivityLogService
}

func NewKeanggotaanEkskulHandler(service *services.KeanggotaanEkskulService, activityService *services.ActivityLogService) *KeanggotaanEkskulHandler {
	return &KeanggotaanEkskulHandler{
		service:         service,
		activityService: activityService,
	}
}

// Add godoc
// @Summary Add student to extracurricular
// @Description Add an extracurricular membership for a student
// @Tags Kesiswaan
// @Accept json
// @Produce json
// @Param request body requests.CreateKeanggotaanEkskulRequest true "Membership data"
// @Success 201 {object} utils.Response{data=responses.KeanggotaanEkskulResponse}
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /keanggotaan-ekskul [post]
func (h *KeanggotaanEkskulHandler) Add(c *gin.Context) {
	var req requests.CreateKeanggotaanEkskulRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Add(req)
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "CREATE", "keanggotaan_ekskul", response.ID,
		fmt.Sprintf("Menambahkan siswa ID %d ke ekskul %s", req.SiswaID, req.NamaKegiatan), c.ClientIP())

	utils.CreatedResponse(c, "Extracurricular membership created successfully", response)
}

// GetAll godoc
// @Summary Get all extracurricular memberships
// @Description Get a list of all extracurricular memberships
// @Tags Kesiswaan
// @Produce json
// @Success 200 {object} utils.Response{data=[]responses.KeanggotaanEkskulResponse}
// @Security BearerAuth
// @Router /keanggotaan-ekskul [get]
func (h *KeanggotaanEkskulHandler) GetAll(c *gin.Context) {
	responses, err := h.service.GetAll()
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.SuccessResponse(c, "Success", responses)
}

// Update godoc
// @Summary Update extracurricular membership
// @Description Update an existing extracurricular membership
// @Tags Kesiswaan
// @Accept json
// @Produce json
// @Param id path int true "Membership ID"
// @Param request body requests.CreateKeanggotaanEkskulRequest true "Membership data"
// @Success 200 {object} utils.Response{data=responses.KeanggotaanEkskulResponse}
// @Security BearerAuth
// @Router /keanggotaan-ekskul/{id} [put]
func (h *KeanggotaanEkskulHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	var req requests.CreateKeanggotaanEkskulRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid request", err.Error())
		return
	}

	response, err := h.service.Update(uint(id), req)
	if err != nil {
		utils.BadRequestResponse(c, err.Error(), nil)
		return
	}

	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "UPDATE", "keanggotaan_ekskul", uint(id),
		fmt.Sprintf("Update keanggotaan ekskul ID %d", id), c.ClientIP())

	utils.SuccessResponse(c, "Updated successfully", response)
}

// Delete godoc
// @Summary Delete extracurricular membership
// @Description Delete an extracurricular membership
// @Tags Kesiswaan
// @Produce json
// @Param id path int true "Membership ID"
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /keanggotaan-ekskul/{id} [delete]
func (h *KeanggotaanEkskulHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequestResponse(c, "Invalid ID", nil)
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	uid, uname := getUserInfo(c)
	h.activityService.LogActivity(uid, uname, "DELETE", "keanggotaan_ekskul", uint(id),
		fmt.Sprintf("Delete keanggotaan ekskul ID %d", id), c.ClientIP())

	utils.SuccessResponse(c, "Deleted successfully", nil)
}

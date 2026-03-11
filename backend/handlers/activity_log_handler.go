package handlers

import (
	"github.com/gin-gonic/gin"
	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/services"
	"daftar_induk_siswa/utils"
)

// ActivityLogHandler handles activity log endpoints
type ActivityLogHandler struct {
	logService *services.ActivityLogService
}

// NewActivityLogHandler creates a new ActivityLogHandler
func NewActivityLogHandler(logService *services.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{logService: logService}
}

// GetLogs godoc
// @Summary Get activity logs
// @Description Get paginated activity logs
// @Tags ActivityLog
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} utils.PaginatedResponse{data=[]responses.ActivityLogResponse}
// @Security BearerAuth
// @Router /activity-logs [get]
func (h *ActivityLogHandler) GetLogs(c *gin.Context) {
	var req requests.PaginationRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.BadRequestResponse(c, "Invalid query parameters", err.Error())
		return
	}

	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 {
		req.PageSize = 20
	}

	logs, pagination, err := h.logService.GetLogs(req.Page, req.PageSize)
	if err != nil {
		utils.InternalServerErrorResponse(c, err.Error())
		return
	}

	utils.PaginatedSuccessResponse(c, "Activity logs retrieved", logs, pagination)
}

package services

import (
	"fmt"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"
)

// ActivityLogService handles activity log business logic
type ActivityLogService struct {
	logRepo *repositories.ActivityLogRepository
}

// NewActivityLogService creates a new ActivityLogService
func NewActivityLogService(logRepo *repositories.ActivityLogRepository) *ActivityLogService {
	return &ActivityLogService{logRepo: logRepo}
}

// LogActivity creates a new activity log entry
func (s *ActivityLogService) LogActivity(userID uint, username, action, entityType string, entityID uint, description, ipAddress string) {
	log := &models.ActivityLog{
		UserID:      userID,
		Username:    username,
		Action:      action,
		EntityType:  entityType,
		EntityID:    entityID,
		Description: description,
		IPAddress:   ipAddress,
	}

	// Fire and forget - don't block on logging errors
	go func() {
		if err := s.logRepo.Create(log); err != nil {
			fmt.Printf("Failed to create activity log: %v\n", err)
		}
	}()
}

// GetLogs returns paginated activity logs
func (s *ActivityLogService) GetLogs(page, pageSize int) ([]responses.ActivityLogResponse, utils.Pagination, error) {
	logs, pagination, err := s.logRepo.FindAll(page, pageSize)
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	var result []responses.ActivityLogResponse
	for _, log := range logs {
		result = append(result, responses.ActivityLogResponse{
			ID:          log.ID,
			UserID:      log.UserID,
			Username:    log.Username,
			Action:      log.Action,
			EntityType:  log.EntityType,
			EntityID:    log.EntityID,
			Description: log.Description,
			IPAddress:   log.IPAddress,
			CreatedAt:   log.CreatedAt,
		})
	}

	return result, pagination, nil
}

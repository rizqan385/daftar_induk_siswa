package repositories

import (
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/utils"
	"gorm.io/gorm"
)

// ActivityLogRepository handles activity log database operations
type ActivityLogRepository struct {
	db *gorm.DB
}

// NewActivityLogRepository creates a new ActivityLogRepository
func NewActivityLogRepository(db *gorm.DB) *ActivityLogRepository {
	return &ActivityLogRepository{db: db}
}

// Create creates a new activity log entry
func (r *ActivityLogRepository) Create(log *models.ActivityLog) error {
	return r.db.Create(log).Error
}

// FindAll returns paginated activity logs
func (r *ActivityLogRepository) FindAll(page, pageSize int) ([]models.ActivityLog, utils.Pagination, error) {
	var logs []models.ActivityLog
	var total int64

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	r.db.Model(&models.ActivityLog{}).Count(&total)

	offset := (page - 1) * pageSize
	err := r.db.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&logs).Error
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	pagination := utils.Pagination{
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return logs, pagination, nil
}

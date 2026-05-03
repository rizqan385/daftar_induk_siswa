import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getActivityLogs } from '../../services/siswa.service';
import type { ActivityLogItem } from '../../services/siswa.service';

const actionBadge: Record<string, { cls: string; label: string }> = {
    'VIEW':   { cls: 'badge badge-info',      label: 'Lihat' },
    'CREATE': { cls: 'badge badge-success',   label: 'Tambah' },
    'UPDATE': { cls: 'badge badge-warning',   label: 'Ubah' },
    'DELETE': { cls: 'badge badge-danger',    label: 'Hapus' },
    'UPLOAD': { cls: 'badge badge-secondary', label: 'Upload' },
    'IMPORT': { cls: 'badge badge-secondary', label: 'Import' },
};

const entityLabels: Record<string, string> = {
    'siswa': '👤 Siswa', 'orang_tua': '👨‍👩‍👦 Orang Tua', 'wali': '🤝 Wali',
    'kesehatan': '🏥 Kesehatan', 'pendidikan': '📚 Pendidikan',
    'kepribadian': '🧠 Kepribadian', 'prestasi': '🏆 Prestasi',
    'beasiswa': '🎓 Beasiswa', 'nilai': '📊 Nilai', 'foto': '📷 Foto',
};

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const LogAktivitas = () => {
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const { data, isLoading } = useQuery({
        queryKey: ['activity-logs', page],
        queryFn: () => getActivityLogs(page, pageSize),
    });

    const logs = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Log Aktivitas" />
                <main className="page-wrapper fade-in">
                    <div className="page-toolbar">
                        <div>
                            <h2 className="page-title">Log Aktivitas</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                                Riwayat aktivitas admin pada sistem data siswa
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        {isLoading ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">⏳</div>
                                <div className="empty-state-text">Memuat log aktivitas...</div>
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <div className="empty-state-text">Belum ada aktivitas tercatat</div>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Waktu</th>
                                            <th>Admin</th>
                                            <th>Aksi</th>
                                            <th>Entitas</th>
                                            <th>Deskripsi</th>
                                            <th>IP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log: ActivityLogItem) => {
                                            const action = actionBadge[log.action] || { cls: 'badge badge-secondary', label: log.action };
                                            const entity = entityLabels[log.entity_type] || log.entity_type;
                                            return (
                                                <tr key={log.id}>
                                                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                                                        {formatDate(log.created_at)}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div className="avatar-placeholder" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                                                                {log.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{log.username}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className={action.cls}>{action.label}</span></td>
                                                    <td style={{ fontSize: '0.875rem' }}>{entity} #{log.entity_id}</td>
                                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '280px' }}>
                                                        {log.description}
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                                                        {log.ip_address}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                style={{ opacity: page <= 1 ? 0.4 : 1 }}
                            >
                                ← Sebelumnya
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                                Halaman {page} dari {pagination.total_pages}
                            </span>
                            <button
                                className="btn btn-outline"
                                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                                disabled={page >= pagination.total_pages}
                                style={{ opacity: page >= pagination.total_pages ? 0.4 : 1 }}
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LogAktivitas;

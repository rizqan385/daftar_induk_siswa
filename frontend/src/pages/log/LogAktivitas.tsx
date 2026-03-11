import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getActivityLogs } from '../../services/siswa.service';
import type { ActivityLogItem } from '../../services/siswa.service';

const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
    'VIEW': { label: 'Lihat', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)' },
    'CREATE': { label: 'Tambah', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
    'UPDATE': { label: 'Ubah', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' },
    'DELETE': { label: 'Hapus', color: '#fb7185', bg: 'rgba(244, 63, 94, 0.15)' },
    'UPLOAD': { label: 'Upload', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)' },
};

const entityLabels: Record<string, string> = {
    'siswa': '👤 Siswa',
    'orang_tua': '👨‍👩‍👦 Orang Tua',
    'wali': '🤝 Wali',
    'kesehatan': '🏥 Kesehatan',
    'pendidikan': '📚 Pendidikan',
    'kepribadian': '🧠 Kepribadian',
    'prestasi': '🏆 Prestasi',
    'beasiswa': '🎓 Beasiswa',
    'nilai': '📊 Nilai',
    'foto': '📷 Foto',
};

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar title="Log Aktivitas" />

                <div className="fade-in" style={{ padding: '32px', maxWidth: '1200px', width: '100%' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{
                            fontSize: "1.8rem",
                            background: "var(--accent-gradient)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block"
                        }}>
                            Log Pembukuan & Aktivitas
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Riwayat siapa yang mengecek, menambah, mengubah, atau menghapus data siswa.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        {isLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Loading log aktivitas...
                            </div>
                        ) : logs.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Belum ada aktivitas tercatat.
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Waktu</th>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Admin</th>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Aksi</th>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Entitas</th>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Deskripsi</th>
                                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log: ActivityLogItem) => {
                                        const action = actionLabels[log.action] || { label: log.action, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
                                        const entity = entityLabels[log.entity_type] || log.entity_type;

                                        return (
                                            <tr
                                                key={log.id}
                                                style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            background: 'var(--accent-gradient)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            flexShrink: 0
                                                        }}>
                                                            {log.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{log.username}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        background: action.bg,
                                                        color: action.color
                                                    }}>
                                                        {action.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                                                    {entity} #{log.entity_id}
                                                </td>
                                                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                                                    {log.description}
                                                </td>
                                                <td style={{ padding: '12px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                    {log.ip_address}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '24px'
                        }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="secondary"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: page <= 1 ? 0.4 : 1 }}
                            >
                                ← Sebelumnya
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Halaman {page} dari {pagination.total_pages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                                disabled={page >= pagination.total_pages}
                                className="secondary"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: page >= pagination.total_pages ? 0.4 : 1 }}
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogAktivitas;

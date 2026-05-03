import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface DashboardStats {
    total_siswa: number;
    total_kelas: number;
    total_mapel: number;
    gender_stats: { jenis_kelamin: string; jumlah: number }[];
    kelas_stats: { tingkat: string; jumlah: number }[];
    kelas_detail: { id: number; nama: string; tingkat: string; jurusan: string; jumlah: number }[];
}

const statCards = [
    {
        key: 'total_siswa', label: 'Total Siswa', color: '#6c4dab', light: '#f3f0ff',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6c4dab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
        key: 'total_kelas', label: 'Total Kelas', color: '#3b82f6', light: '#eff6ff',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
        key: 'total_mapel', label: 'Mata Pelajaran', color: '#22c55e', light: '#f0fdf4',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    },
];

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const userName = localStorage.getItem('userName') || 'Admin';

    const genderData = {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{
            data: [
                stats?.gender_stats?.find(g => g.jenis_kelamin === 'L')?.jumlah || 0,
                stats?.gender_stats?.find(g => g.jenis_kelamin === 'P')?.jumlah || 0,
            ],
            backgroundColor: ['#6c4dab', '#ec4899'],
            borderWidth: 0,
        }],
    };

    const kelasData = {
        labels: stats?.kelas_detail?.map(k => k.nama) || [],
        datasets: [{
            label: 'Jumlah Siswa',
            data: stats?.kelas_detail?.map(k => k.jumlah) || [],
            backgroundColor: '#6c4dab',
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Dashboard" />
                <main className="page-wrapper fade-in">

                    {/* Welcome Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6c4dab 0%, #9b72e6 100%)',
                        borderRadius: '14px',
                        padding: '24px 28px',
                        marginBottom: '24px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                        <div style={{ position: 'absolute', right: '80px', bottom: '-50px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
                                Selamat Datang, {userName}!
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                                Berikut ringkasan data induk siswa hari ini
                            </div>
                        </div>
                        <div style={{ opacity: 0.4, color: 'white' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">⏳</div>
                            <div className="empty-state-text">Memuat data dashboard...</div>
                        </div>
                    ) : (
                        <>
                            {/* Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                {statCards.map(card => (
                                    <div key={card.key} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div className="stat-card-icon" style={{ background: card.light }}>
                                            <span style={{ fontSize: '1.4rem' }}>{card.icon}</span>
                                        </div>
                                        <div>
                                            <div className="stat-card-value" style={{ color: card.color }}>
                                                {(stats as any)?.[card.key] ?? 0}
                                            </div>
                                            <div className="stat-card-label">{card.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                {/* Donut */}
                                <div className="card card-body" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                                        Distribusi Gender
                                    </div>
                                    <div style={{ maxWidth: '220px', margin: '0 auto', flex: 1 }}>
                                        <Doughnut
                                            data={genderData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: { color: '#6b7280', padding: 12, usePointStyle: true, font: { size: 12 } }
                                                    }
                                                },
                                                cutout: '68%',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="card card-body">
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                                        Siswa per Kelas
                                    </div>
                                    <Bar
                                        data={kelasData}
                                        options={{
                                            responsive: true,
                                            plugins: { legend: { display: false } },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { color: '#9ca3af', stepSize: 1, font: { size: 11 } },
                                                    grid: { color: '#f3f4f6' }
                                                },
                                                x: {
                                                    ticks: { color: '#9ca3af', font: { size: 11 } },
                                                    grid: { display: false }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Kelas Detail Table */}
                            {(stats?.kelas_detail?.length ?? 0) > 0 && (
                                <div className="card" style={{ marginTop: '16px' }}>
                                    <div className="card-header">
                                        <div className="card-title">Detail Per Kelas</div>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Nama Kelas</th>
                                                    <th>Tingkat</th>
                                                    <th>Jurusan</th>
                                                    <th>Jumlah Siswa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats?.kelas_detail?.map(k => (
                                                    <tr key={k.id}>
                                                        <td style={{ fontWeight: 600 }}>{k.nama}</td>
                                                        <td>
                                                            <span className="badge badge-info">{k.tingkat}</span>
                                                        </td>
                                                        <td style={{ color: 'var(--text-secondary)' }}>{k.jurusan || '-'}</td>
                                                        <td>
                                                            <span className="badge badge-success">{k.jumlah} siswa</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;

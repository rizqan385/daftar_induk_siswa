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

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const userName = localStorage.getItem('userName') || 'Admin';

    const genderData = {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{
            data: [
                stats?.gender_stats?.find(g => g.jenis_kelamin === 'L')?.jumlah || 0,
                stats?.gender_stats?.find(g => g.jenis_kelamin === 'P')?.jumlah || 0,
            ],
            backgroundColor: ['#3b82f6', '#ec4899'],
            borderColor: ['#2563eb', '#db2777'],
            borderWidth: 2,
        }],
    };

    const kelasLabels = stats?.kelas_detail?.map(k => k.nama) || ['X', 'XI', 'XII'];
    const kelasValues = stats?.kelas_detail?.map(k => k.jumlah) || [0, 0, 0];

    const kelasData = {
        labels: kelasLabels,
        datasets: [{
            label: 'Jumlah Siswa',
            data: kelasValues,
            backgroundColor: [
                '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
            ],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                    {/* Welcome */}
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.5rem' }}>
                        Selamat Datang, <span style={{ color: '#3b82f6' }}>{userName}</span> 👋
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                        Berikut ringkasan data sekolah Anda
                    </p>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            Memuat data...
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                                {[
                                    { label: 'Total Siswa', value: stats?.total_siswa || 0, icon: '👥', color: '#3b82f6' },
                                    { label: 'Total Kelas', value: stats?.total_kelas || 0, icon: '🏫', color: '#8b5cf6' },
                                    { label: 'Total Mapel', value: stats?.total_mapel || 0, icon: '📚', color: '#10b981' },
                                ].map((card, i) => (
                                    <div key={i} style={{
                                        background: 'var(--bg-surface)',
                                        borderRadius: '14px',
                                        padding: '24px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                    }}>
                                        <div style={{
                                            width: '52px', height: '52px',
                                            borderRadius: '12px',
                                            background: `${card.color}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }}>
                                            {card.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {card.value}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {card.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Gender Donut */}
                                <div style={{
                                    background: 'var(--bg-surface)',
                                    borderRadius: '14px',
                                    padding: '24px',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                }}>
                                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>
                                        📊 Distribusi Gender
                                    </h3>
                                    <div style={{ maxWidth: '280px', margin: '0 auto' }}>
                                        <Doughnut
                                            data={genderData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: { color: '#94a3b8', padding: 16, usePointStyle: true }
                                                    }
                                                },
                                                cutout: '65%',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Kelas Bar */}
                                <div style={{
                                    background: 'var(--bg-surface)',
                                    borderRadius: '14px',
                                    padding: '24px',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                }}>
                                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>
                                        📈 Siswa per Kelas
                                    </h3>
                                    <Bar
                                        data={kelasData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { color: '#94a3b8', stepSize: 1 },
                                                    grid: { color: 'rgba(148,163,184,0.1)' }
                                                },
                                                x: {
                                                    ticks: { color: '#94a3b8', font: { size: 11 } },
                                                    grid: { display: false }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;

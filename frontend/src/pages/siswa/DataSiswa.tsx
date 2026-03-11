import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSiswa, useDeleteSiswa } from "../../hooks/useSiswa";
import api from '../../services/api';
import * as XLSX from 'xlsx';

const DataSiswa = () => {
    const { data, isLoading } = useSiswa();
    const siswaList = data?.data || [];
    const deleteSiswa = useDeleteSiswa();
    const navigate = useNavigate();
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [filterKelas, setFilterKelas] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        api.get('/kelas').then(res => setKelasList(res.data.data || [])).catch(() => {});
    }, []);

    const getKelasName = (kelasId: number) => kelasList.find((k: any) => k.id === kelasId)?.nama || '-';

    const filtered = siswaList.filter((siswa: any) => {
        const matchKelas = !filterKelas || String(siswa.kelas_id) === filterKelas;
        const matchSearch = !searchTerm || 
            (siswa.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (siswa.nisn || '').includes(searchTerm) ||
            (siswa.no_induk || '').includes(searchTerm);
        return matchKelas && matchSearch;
    });

    const openCreatePage = () => navigate('/siswa/new');
    const openEditPage = (id: number) => navigate(`/siswa/${id}`);
    const handleDelete = (id: number) => {
        if (window.confirm("Yakin ingin menghapus siswa ini?")) {
            deleteSiswa.mutate(id);
        }
    };

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

    const handleImportExcel = async () => {
        if (!importFile) return;
        setImporting(true);
        setImportMsg(null);
        const formData = new FormData();
        formData.append('file', importFile);
        try {
            const res = await api.post('/siswa/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const count = res.data?.data?.imported_count ?? 0;
            setImportMsg({ type: 'success', text: `${count} siswa berhasil diimport!` });
            setImportFile(null);
            // Refresh page data after short delay
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            const errMsg = err?.response?.data?.errors || err?.response?.data?.message || 'Gagal import file Excel';
            setImportMsg({ type: 'error', text: errMsg });
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const wsData = [
            ['NISN', 'NIS', 'Nama Lengkap', 'Jenis Kelamin (L/P)', 'Kelas'],
            ['0012345678', '12345', 'Ahmad Rizki', 'L', 'X TKJ'],
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        // Set column widths for readability
        ws['!cols'] = [
            { wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 12 }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
        XLSX.writeFile(wb, 'template_import_siswa.xlsx');
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
        background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem'
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
            'aktif': { bg: '#10b98120', color: '#10b981' },
            'lulus': { bg: '#3b82f620', color: '#3b82f6' },
            'pindah': { bg: '#f59e0b20', color: '#f59e0b' },
            'tinggal_kelas': { bg: '#ef444420', color: '#ef4444' },
            'keluar': { bg: '#6b728020', color: '#6b7280' },
        };
        const c = colors[status] || colors['aktif'];
        const label = status === 'tinggal_kelas' ? 'Tinggal Kelas' : 
                      status === 'keluar' ? 'Tidak Aktif Lagi' : 
                      (status || 'Aktif').charAt(0).toUpperCase() + (status || 'aktif').slice(1);
        return (
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: c.bg, color: c.color }}>
                {label}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>👥 Data Siswa</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => { setShowImportModal(true); setImportMsg(null); setImportFile(null); }} style={{ padding: '10px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📥 Import Excel
                            </button>
                            <button onClick={openCreatePage} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                                + Tambah Siswa
                            </button>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <input placeholder="🔍 Cari nama / NISN / NIS..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, width: '300px' }} />
                        <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} style={{ ...inputStyle, width: '200px' }}>
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                        </select>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        {isLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                        {['No', 'Foto', 'NISN/NIS', 'Nama', 'L/P', 'Kelas', 'Status', 'Aksi'].map(h => (
                                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                Tidak ada data siswa
                                            </td>
                                        </tr>
                                    ) : filtered.map((siswa: any, i: number) => (
                                        <tr key={siswa.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                {siswa.foto_path ? (
                                                    <img src={`${API_BASE}/uploads/${siswa.foto_path}`} alt="foto"
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                                                        {(siswa.nama_lengkap || 'S').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{siswa.nisn}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{siswa.no_induk}</div>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{siswa.nama_lengkap}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                                                    background: siswa.jenis_kelamin === 'L' ? '#3b82f620' : '#ec489920',
                                                    color: siswa.jenis_kelamin === 'L' ? '#3b82f6' : '#ec4899'
                                                }}>
                                                    {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{getKelasName(siswa.kelas_id)}</td>
                                            <td style={{ padding: '12px 16px' }}>{statusBadge(siswa.status || 'aktif')}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => openEditPage(siswa.id)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                                                    <button onClick={() => handleDelete(siswa.id)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Import Excel Modal */}
                    {showImportModal && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowImportModal(false)}>
                            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>📥 Import Data Siswa</h3>
                                    <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
                                    Upload file Excel (.xlsx / .csv) dengan kolom:<br />
                                    <strong>NISN, NIS, Nama Lengkap, Jenis Kelamin (L/P), Kelas</strong>
                                </p>

                                <button onClick={downloadTemplate} style={{ background: 'none', border: '1px dashed var(--border-color)', color: '#3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                                    📄 Download Template Excel
                                </button>

                                {/* Drop zone */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={e => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) setImportFile(f); }}
                                    style={{
                                        border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '32px', textAlign: 'center',
                                        cursor: 'pointer', background: importFile ? 'rgba(16,185,129,0.05)' : 'transparent', transition: 'all 0.2s',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setImportFile(e.target.files[0]); }} />
                                    {importFile ? (
                                        <div>
                                            <span style={{ fontSize: '2rem' }}>✅</span>
                                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '8px' }}>{importFile.name}</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{(importFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <span style={{ fontSize: '2rem' }}>📁</span>
                                            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Klik atau drop file Excel di sini</p>
                                        </div>
                                    )}
                                </div>

                                {importMsg && (
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', background: importMsg.type === 'success' ? '#10b98120' : '#ef444420', color: importMsg.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {importMsg.text}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowImportModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 500 }}>
                                        Batal
                                    </button>
                                    <button onClick={handleImportExcel} disabled={!importFile || importing} style={{ padding: '10px 24px', borderRadius: '8px', background: !importFile || importing ? '#6b7280' : '#10b981', color: '#fff', border: 'none', cursor: !importFile || importing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {importing ? '⏳ Mengimport...' : '🚀 Import Sekarang'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DataSiswa;

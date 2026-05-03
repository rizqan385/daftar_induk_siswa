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
        const q = searchTerm.toLowerCase();
        const matchSearch = !searchTerm ||
            (siswa.nama || siswa.nama_lengkap || '').toLowerCase().includes(q) ||
            (siswa.nisn || '').includes(searchTerm) ||
            (siswa.no_induk || '').includes(searchTerm);
        return matchKelas && matchSearch;
    });

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

    const handleDelete = (id: number) => {
        if (window.confirm("Yakin ingin menghapus siswa ini?")) {
            deleteSiswa.mutate(id);
        }
    };

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
        ws['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 12 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
        XLSX.writeFile(wb, 'template_import_siswa.xlsx');
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { cls: string; label: string }> = {
            'aktif':        { cls: 'badge badge-success', label: 'Aktif' },
            'lulus':        { cls: 'badge badge-info', label: 'Lulus' },
            'pindah':       { cls: 'badge badge-warning', label: 'Pindah' },
            'tinggal_kelas':{ cls: 'badge badge-danger', label: 'Tinggal Kelas' },
            'keluar':       { cls: 'badge badge-secondary', label: 'Tidak Aktif' },
        };
        const s = map[status] || map['aktif'];
        return <span className={s.cls}>{s.label}</span>;
    };

    const getGenderBadge = (jk: string) => {
        const isL = jk === 'L';
        return (
            <span className={`badge ${isL ? 'badge-info' : 'badge-danger'}`}>
                {isL ? 'Laki-laki' : 'Perempuan'}
            </span>
        );
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Data Siswa" />
                <main className="page-wrapper fade-in">

                    {/* Toolbar */}
                    <div className="page-toolbar">
                        <div className="page-toolbar-left">
                            <h2 className="page-title">Data Siswa</h2>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Total: <strong style={{ color: 'var(--accent)' }}>{filtered.length}</strong> siswa
                            </span>
                        </div>
                        <div className="page-toolbar-right">
                            <button
                                className="btn btn-outline"
                                onClick={() => { setShowImportModal(true); setImportMsg(null); setImportFile(null); }}
                            >
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Import Excel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/siswa/new')}
                            >
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah Siswa
                            </button>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="card">
                        {/* Search & Filter */}
                        <div className="card-header">
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div className="search-input-wrapper">
                                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="8" cy="8" r="6" /><path d="m13 13 4 4" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Cari nama, NISN, NIS..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterKelas}
                                    onChange={e => setFilterKelas(e.target.value)}
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                                </select>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Menampilkan {filtered.length} dari {siswaList.length}
                            </div>
                        </div>

                        {/* Table */}
                        {isLoading ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">⏳</div>
                                <div className="empty-state-text">Memuat data siswa...</div>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Foto</th>
                                            <th>Nama Siswa</th>
                                            <th>NISN / NIS</th>
                                            <th>Jenis Kelamin</th>
                                            <th>Kelas</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className="empty-state">
                                                        <div className="empty-state-icon">👤</div>
                                                        <div className="empty-state-text">Tidak ada data siswa ditemukan</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filtered.map((siswa: any, i: number) => (
                                            <tr key={siswa.id}>
                                                <td style={{ color: 'var(--text-muted)', width: '50px' }}>{i + 1}</td>
                                                <td style={{ width: '60px' }}>
                                                    {siswa.foto_path ? (
                                                        <img
                                                            src={`${API_BASE}/uploads/${siswa.foto_path}`}
                                                            alt="foto"
                                                            className="avatar"
                                                        />
                                                    ) : (
                                                        <div className="avatar-placeholder">
                                                            {((siswa.nama || siswa.nama_lengkap) || 'S').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                        {siswa.nama || siswa.nama_lengkap || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{siswa.nisn}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{siswa.no_induk}</div>
                                                </td>
                                                <td>{getGenderBadge(siswa.jenis_kelamin)}</td>
                                                <td style={{ fontWeight: 500 }}>{getKelasName(siswa.kelas_id)}</td>
                                                <td>{getStatusBadge(siswa.status || 'aktif')}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <button
                                                            className="action-btn"
                                                            onClick={() => navigate(`/siswa/${siswa.id}`)}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="action-btn danger"
                                                            onClick={() => handleDelete(siswa.id)}
                                                            title="Hapus"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Import Modal */}
                    {showImportModal && (
                        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
                            <div className="modal-box" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <div className="modal-title">📥 Import Data Siswa</div>
                                    <button className="modal-close" onClick={() => setShowImportModal(false)}>×</button>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
                                    Upload file Excel (.xlsx) dengan kolom:<br />
                                    <strong>NISN, NIS, Nama Lengkap, Jenis Kelamin (L/P), Kelas</strong>
                                </p>

                                <button
                                    className="btn btn-outline"
                                    style={{ marginBottom: '16px', width: '100%', justifyContent: 'center', borderStyle: 'dashed' }}
                                    onClick={downloadTemplate}
                                >
                                    📄 Download Template Excel
                                </button>

                                {/* Drop zone */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={e => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) setImportFile(f); }}
                                    style={{
                                        border: `2px dashed ${importFile ? 'var(--success)' : 'var(--border)'}`,
                                        borderRadius: '10px',
                                        padding: '28px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: importFile ? 'var(--success-bg)' : 'var(--bg-surface)',
                                        marginBottom: '16px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setImportFile(e.target.files[0]); }} />
                                    {importFile ? (
                                        <div>
                                            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>✅</div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{importFile.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>{(importFile.size / 1024).toFixed(1)} KB</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📁</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Klik atau drag & drop file Excel di sini</div>
                                        </div>
                                    )}
                                </div>

                                {importMsg && (
                                    <div className={`badge ${importMsg.type === 'success' ? 'badge-success' : 'badge-danger'}`}
                                        style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                                        {importMsg.text}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-outline" onClick={() => setShowImportModal(false)}>Batal</button>
                                    <button
                                        className="btn btn-green"
                                        onClick={handleImportExcel}
                                        disabled={!importFile || importing}
                                        style={{ opacity: !importFile || importing ? 0.6 : 1, cursor: !importFile || importing ? 'not-allowed' : 'pointer' }}
                                    >
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

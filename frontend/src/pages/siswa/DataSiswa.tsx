import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSiswa, useDeleteSiswa } from "../../hooks/useSiswa";
import api from '../../services/api';
import * as XLSX from 'xlsx';

/* =================== TYPE =================== */
interface RaportPreview {
    nama_sekolah: string;
    nama_kelas: string;
    wali_kelas: string;
    semester: string;
    tahun_pelajaran: string;
    jumlah_siswa: number;
    mata_pelajaran: string[];
    siswa: { nomor: number; nama: string; nisn: string; status: string }[];
}

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

    // Raport import states
    const [importMode, setImportMode] = useState<'template' | 'raport'>('raport');
    const [previewing, setPreviewing] = useState(false);
    const [raportPreview, setRaportPreview] = useState<RaportPreview | null>(null);


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

    const resetModal = () => {
        setImportFile(null);
        setImportMsg(null);
        setRaportPreview(null);
        setPreviewing(false);
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = async (file: File) => {
        setImportFile(file);
        setRaportPreview(null);
        setImportMsg(null);
        if (importMode === 'raport') {
            // Auto-preview saat file dipilih
            setPreviewing(true);
            try {
                const fd = new FormData();
                fd.append('file', file);
                const res = await api.post('/siswa/preview-raport', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setRaportPreview(res.data?.data || null);
            } catch (err: any) {
                setImportMsg({ type: 'error', text: err?.response?.data?.message || 'Gagal membaca file raport. Pastikan format file sesuai.' });
            } finally {
                setPreviewing(false);
            }
        }
    };

    const handleImportExcel = async () => {
        if (!importFile) return;
        setImporting(true);
        setImportMsg(null);
        const formData = new FormData();
        formData.append('file', importFile);
        try {
            const endpoint = importMode === 'raport' ? '/siswa/import-raport' : '/siswa/import';
            const res = await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (importMode === 'raport') {
                const d = res.data?.data;
                setImportMsg({ type: 'success', text: `✅ Import berhasil! ${d?.imported_siswa ?? 0} siswa baru, ${d?.updated_nilai ?? 0} nilai diupdate, ${d?.updated_catatan ?? 0} catatan tersimpan.` });
            } else {
                const count = res.data?.data?.imported_count ?? 0;
                setImportMsg({ type: 'success', text: `✅ ${count} siswa berhasil diimport!` });
            }
            setImportFile(null);
            setRaportPreview(null);
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            const errMsg = err?.response?.data?.errors || err?.response?.data?.message || 'Gagal import file Excel';
            setImportMsg({ type: 'error', text: typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) });
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
                                        aria-label="Cari nama, NISN, atau NIS"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="filter-select"
                                    aria-label="Filter kelas"
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
                        <div className="modal-overlay" onClick={() => { setShowImportModal(false); resetModal(); }}>
                            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: raportPreview ? '720px' : '480px', width: '95vw', transition: 'max-width 0.3s' }}>
                                <div className="modal-header">
                                    <div className="modal-title">📥 Import Data Siswa</div>
                                    <button className="modal-close" onClick={() => { setShowImportModal(false); resetModal(); }}>×</button>
                                </div>

                                {/* Mode Tabs */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', background: 'var(--bg-surface)', borderRadius: '10px', padding: '4px' }}>
                                    {(['raport', 'template'] as const).map(mode => (
                                        <button key={mode} onClick={() => { setImportMode(mode); resetModal(); }} style={{
                                            flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                                            background: importMode === mode ? 'var(--accent)' : 'transparent',
                                            color: importMode === mode ? '#fff' : 'var(--text-muted)'
                                        }}>
                                            {mode === 'raport' ? '📊 Format Raport SMK' : '📋 Format Template Biasa'}
                                        </button>
                                    ))}
                                </div>

                                {/* Mode description */}
                                {importMode === 'raport' ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.6, background: 'var(--accent-bg, rgba(99,102,241,0.08))', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                                        🤖 <strong>Deteksi Otomatis</strong> — Upload file raport Excel (.xlsx) format SMK.<br />
                                        Sistem akan otomatis mendeteksi: <strong>kelas, wali kelas, mata pelajaran, nilai, catatan, dan kehadiran</strong>.
                                    </p>
                                ) : (
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', lineHeight: 1.6 }}>
                                            Upload file Excel dengan kolom: <strong>NISN, NIS, Nama Lengkap, Jenis Kelamin (L/P), Kelas</strong>
                                        </p>
                                        <button className="btn btn-outline" style={{ marginBottom: '14px', width: '100%', justifyContent: 'center', borderStyle: 'dashed' }} onClick={downloadTemplate}>
                                            📄 Download Template Excel
                                        </button>
                                    </div>
                                )}

                                {/* Drop zone */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={e => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) handleFileChange(f); }}
                                    style={{
                                        border: `2px dashed ${importFile ? 'var(--success)' : 'var(--border)'}`,
                                        borderRadius: '10px', padding: '22px', textAlign: 'center', cursor: 'pointer',
                                        background: importFile ? 'var(--success-bg, rgba(16,185,129,0.06))' : 'var(--bg-surface)',
                                        marginBottom: '14px', transition: 'all 0.2s'
                                    }}
                                >
                                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
                                        onChange={e => { if (e.target.files?.[0]) handleFileChange(e.target.files[0]); }} />
                                    {previewing ? (
                                        <div><div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>⏳</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Membaca file dan mendeteksi data...</div></div>
                                    ) : importFile ? (
                                        <div>
                                            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>📄</div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{importFile.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>{(importFile.size / 1024).toFixed(1)} KB · <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); resetModal(); }}>Ganti file</span></div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>📁</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Klik atau drag &amp; drop file Excel di sini</div>
                                        </div>
                                    )}
                                </div>

                                {/* Raport Preview Panel */}
                                {raportPreview && (
                                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', marginBottom: '14px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            ✅ Data Terdeteksi Otomatis
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                            {[
                                                ['🏫 Sekolah', raportPreview.nama_sekolah],
                                                ['🏫 Kelas', raportPreview.nama_kelas],
                                                ['👤 Wali Kelas', raportPreview.wali_kelas],
                                                ['📅 Semester', raportPreview.semester],
                                                ['📅 Tahun Pelajaran', raportPreview.tahun_pelajaran],
                                                ['👥 Jumlah Siswa', String(raportPreview.siswa.length) + ' terdeteksi'],
                                            ].map(([label, val]) => (
                                                <div key={label} style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '8px 12px' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{val || '-'}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>📚 Mata Pelajaran ({raportPreview.mata_pelajaran.length}):</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {raportPreview.mata_pelajaran.map(mp => (
                                                    <span key={mp} style={{ fontSize: '0.72rem', background: 'var(--accent-bg, rgba(99,102,241,0.1))', color: 'var(--accent)', padding: '2px 8px', borderRadius: '20px' }}>{mp}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                                                👥 Siswa: <span style={{ color: 'var(--success)' }}>{raportPreview.siswa.filter(s => s.status === 'new').length} baru</span>
                                                {' · '}
                                                <span style={{ color: 'var(--warning, orange)' }}>{raportPreview.siswa.filter(s => s.status === 'exists').length} sudah ada (nilai akan diupdate)</span>
                                            </div>
                                            <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                                <table style={{ width: '100%', fontSize: '0.76rem', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: 'var(--bg-surface)' }}>
                                                            <th style={{ padding: '5px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>No</th>
                                                            <th style={{ padding: '5px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Nama</th>
                                                            <th style={{ padding: '5px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>NISN</th>
                                                            <th style={{ padding: '5px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {raportPreview.siswa.map(s => (
                                                            <tr key={s.nisn} style={{ borderTop: '1px solid var(--border)' }}>
                                                                <td style={{ padding: '4px 10px', color: 'var(--text-muted)' }}>{s.nomor}</td>
                                                                <td style={{ padding: '4px 10px', color: 'var(--text-primary)', fontWeight: 500 }}>{s.nama}</td>
                                                                <td style={{ padding: '4px 10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.nisn}</td>
                                                                <td style={{ padding: '4px 10px' }}>
                                                                    <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '20px', fontWeight: 600, background: s.status === 'new' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: s.status === 'new' ? 'var(--success)' : 'var(--warning, orange)' }}>
                                                                        {s.status === 'new' ? '✦ Baru' : '↻ Update'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {importMsg && (
                                    <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem', background: importMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: importMsg.type === 'success' ? 'var(--success)' : 'var(--danger)', border: `1px solid ${importMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                                        {importMsg.text}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-outline" onClick={() => { setShowImportModal(false); resetModal(); }}>Batal</button>
                                    <button
                                        className="btn btn-green"
                                        onClick={handleImportExcel}
                                        disabled={!importFile || importing || previewing}
                                        style={{ opacity: (!importFile || importing || previewing) ? 0.6 : 1, cursor: (!importFile || importing || previewing) ? 'not-allowed' : 'pointer' }}
                                    >
                                        {importing ? '⏳ Mengimport...' : importMode === 'raport' ? '🚀 Import Raport' : '🚀 Import Sekarang'}
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




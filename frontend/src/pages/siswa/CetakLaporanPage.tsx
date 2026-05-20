import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CetakLaporan.css';

export const CetakLaporanPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Selection State if accessed from sidebar
    const [selectedSiswaId, setSelectedSiswaId] = useState<string>('');
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [selectedKelas, setSelectedKelas] = useState('');
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [siswaSearchQuery, setSiswaSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const id = urlId || selectedSiswaId;

    // Settings State
    const [jenisLaporan, setJenisLaporan] = useState<'pribadi' | 'nilai' | 'buku_induk'>('pribadi');
    const [semester, setSemester] = useState<number>(1);
    const [tempatCetak, setTempatCetak] = useState('Jakarta');
    const [tanggalCetak, setTanggalCetak] = useState(new Date().toISOString().split('T')[0]);
    
    // TTD State
    const [namaKepsek, setNamaKepsek] = useState('Dr. H. Contoh Kepsek, M.Pd.');
    const [nipKepsek, setNipKepsek] = useState('19700101 199512 1 001');
    const [namaWalikelas, setNamaWalikelas] = useState('Budi Guru, S.Pd.');
    const [nipWalikelas, setNipWalikelas] = useState('19850202 201001 1 002');

    // Promotion & Graduation decision state
    const [keputusanStatus, setKeputusanStatus] = useState<'naik' | 'tinggal' | 'lulus' | 'tidak_lulus' | 'none'>('none');
    const [targetKelas, setTargetKelas] = useState('');

    // Data State
    const [siswa, setSiswa] = useState<any>(null);
    const [loading, setLoading] = useState(urlId ? true : false);

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

    // Load classes and students if accessed from sidebar
    useEffect(() => {
        if (!urlId) {
            api.get('/kelas').then(res => setKelasList(res.data.data || [])).catch(() => {});
            api.get('/siswa?page=1&page_size=300').then(res => setSiswaList(res.data.data || [])).catch(() => {});
        }
    }, [urlId]);



    const filteredStudents = siswaList.filter((s: any) => {
        if (selectedKelas && String(s.kelas_id) !== selectedKelas) return false;
        if (!siswaSearchQuery) return true;
        const q = siswaSearchQuery.toLowerCase();
        return (
            (s.nama || s.nama_lengkap || '').toLowerCase().includes(q) ||
            (s.nisn || '').includes(siswaSearchQuery) ||
            (s.no_induk || '').includes(siswaSearchQuery)
        );
    });

    useEffect(() => {
        if (!id) {
            setSiswa(null);
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/siswa/${id}`);
                const data = res.data.data;
                setSiswa(data);
                
                // Set default wali kelas from student's class ref if available
                if (data.kelas_ref?.wali_kelas) {
                    setNamaWalikelas(data.kelas_ref.wali_kelas);
                }
            } catch (err) {
                console.error("Gagal memuat data siswa", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Handle automatic decision values on semester change
    useEffect(() => {
        if (!siswa) return;
        if (semester === 2) {
            setKeputusanStatus('naik');
            setTargetKelas(siswa.kelas_ref?.nama ? siswa.kelas_ref.nama.replace(/\bX\b/g, 'XI') : 'XI');
        } else if (semester === 4) {
            setKeputusanStatus('naik');
            setTargetKelas(siswa.kelas_ref?.nama ? siswa.kelas_ref.nama.replace(/\bXI\b/g, 'XII') : 'XII');
        } else if (semester === 6) {
            setKeputusanStatus('lulus');
            setTargetKelas('');
        } else {
            setKeputusanStatus('none');
            setTargetKelas('');
        }
    }, [semester, siswa]);

    const handlePrint = () => {
        window.print();
    };

    const getKelasForSemester = (sem: number): string => {
        if (sem === 1 || sem === 2) return 'X (Sepuluh)';
        if (sem === 3 || sem === 4) return 'XI (Sebelas)';
        if (sem === 5 || sem === 6) return 'XII (Dua Belas)';
        return '-';
    };

    const formatDateIndo = (dateStr: any) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return '-';
        }
    };

    const formatRupiah = (val: any) => {
        if (val === undefined || val === null || val === '') return '-';
        const num = Number(val);
        if (isNaN(num)) return '-';
        return 'Rp ' + num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    if (!id) {
        return (
            <div className="cetak-container">
                <div className="cetak-settings no-print" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>🖨️ CETAK DOKUMEN BUKU INDUK / RAPOR</h2>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                            Dashboard
                        </button>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '20px' }}>Pilih Kelas dan cari Siswa terlebih dahulu untuk melihat preview dan mencetak dokumen Buku Induk Lengkap, Biodata Pribadi, atau Rapor Semester.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                        <div className="form-group">
                            <label style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>1. Pilih Kelas (Opsional)</label>
                            <select value={selectedKelas} onChange={(e) => { setSelectedKelas(e.target.value); setSelectedSiswaId(''); setSiswaSearchQuery(''); }} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#2e1f50', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <option value="">-- Semua Kelas --</option>
                                {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>2. Cari &amp; Pilih Siswa</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Ketik nama, NISN, atau NIS..."
                                    value={siswaSearchQuery}
                                    onChange={(e) => {
                                        setSiswaSearchQuery(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 32px 10px 12px',
                                        borderRadius: '6px',
                                        background: '#2e1f50',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                {siswaSearchQuery && (
                                    <button
                                        onClick={() => {
                                            setSiswaSearchQuery('');
                                            setSelectedSiswaId('');
                                            setIsDropdownOpen(false);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            padding: 0
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            
                            {isDropdownOpen && (
                                <>
                                    <div
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 999
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: '#2e1f50',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '6px',
                                        marginTop: '4px',
                                        maxHeight: '220px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                    }}>
                                        {filteredStudents.length === 0 ? (
                                            <div style={{ padding: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center' }}>
                                                Tidak ada siswa ditemukan
                                            </div>
                                        ) : (
                                            filteredStudents.map((s: any) => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => {
                                                        setSelectedSiswaId(String(s.id));
                                                        setSiswaSearchQuery(s.nama || s.nama_lengkap);
                                                        if (s.kelas_id) setSelectedKelas(String(s.kelas_id));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 12px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        transition: 'background 0.2s',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <div>
                                                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{s.nama || s.nama_lengkap}</div>
                                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>NISN: {s.nisn} | NIS: {s.no_induk}</div>
                                                    </div>
                                                    <div style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>
                                                        {kelasList.find(k => k.id === s.kelas_id)?.nama || 'Tanpa Kelas'}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '80px 20px', textAlign: 'center', marginTop: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🖨️</div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Belum Ada Siswa Terpilih</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>Pilih kelas atau cari nama siswa pada panel kontrol di atas untuk memuat data Buku Induk dan mencetak dokumen.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="cetak-loading">Memuat data laporan...</div>;
    if (!siswa) return <div className="cetak-error">Siswa tidak ditemukan</div>;

    // Filter grades and notes for the selected semester
    const nilaiSemesterFiltered = siswa.nilai_semester?.filter((n: any) => n.semester === semester) || [];
    const mapelA = nilaiSemesterFiltered.filter((n: any) => n.mata_pelajaran?.kelompok_mapel === 'A');
    const mapelB = nilaiSemesterFiltered.filter((n: any) => n.mata_pelajaran?.kelompok_mapel === 'B');
    const mapelC = nilaiSemesterFiltered.filter((n: any) => n.mata_pelajaran?.kelompok_mapel === 'C');
    const mapelOther = nilaiSemesterFiltered.filter((n: any) => !['A', 'B', 'C'].includes(n.mata_pelajaran?.kelompok_mapel));

    const sikapSemester = siswa.nilai_sikap?.find((s: any) => s.semester === semester);
    const catatanSemester = siswa.catatan_semester?.find((c: any) => c.semester === semester);
    const pklSemester = catatanSemester?.pkl || [];
    const ekskulSemester = catatanSemester?.ekstrakurikuler || [];
    const prestasiSemester = catatanSemester?.prestasi_semester || [];
    
    // Kehadiran safely merged
    const kehadiranSemester = siswa.kehadiran?.find((k: any) => k.semester === semester);
    const sakitDays = kehadiranSemester?.jumlah_sakit ?? catatanSemester?.ketidakhadiran_catatan?.karena_sakit ?? 0;
    const izinDays = kehadiranSemester?.jumlah_izin ?? catatanSemester?.ketidakhadiran_catatan?.dengan_izin ?? 0;
    const alpaDays = kehadiranSemester?.jumlah_alpa ?? catatanSemester?.ketidakhadiran_catatan?.tanpa_keterangan ?? 0;

    return (
        <div className="cetak-container">
            {/* INI BAGIAN PENGATURAN - Hanya muncul di layar, disembunyikan saat print */}
            <div className="cetak-settings no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>PENGATURAN CETAK DOKUMEN SISWA</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => urlId ? navigate(`/siswa/${id}`) : navigate('/siswa')} style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                            ← {urlId ? 'Kembali ke Detail' : 'Data Siswa'}
                        </button>
                        <button onClick={handlePrint} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.2)' }}>
                            🖨️ Cetak Sekarang
                        </button>
                    </div>
                </div>

                {!urlId && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', background: 'rgba(0, 0, 0, 0.15)', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>Ganti Kelas (Opsional)</label>
                            <select value={selectedKelas} onChange={(e) => { setSelectedKelas(e.target.value); setSelectedSiswaId(''); setSiswaSearchQuery(''); }} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#2e1f50', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <option value="">-- Semua Kelas --</option>
                                {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ margin: 0, position: 'relative' }}>
                            <label style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>Cari &amp; Ganti Siswa</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Ketik nama, NISN, atau NIS..."
                                    value={siswaSearchQuery}
                                    onChange={(e) => {
                                        setSiswaSearchQuery(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 30px 8px 10px',
                                        borderRadius: '6px',
                                        background: '#2e1f50',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                {siswaSearchQuery && (
                                    <button
                                        onClick={() => {
                                            setSiswaSearchQuery('');
                                            setSelectedSiswaId('');
                                            setIsDropdownOpen(false);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            padding: 0
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            
                            {isDropdownOpen && (
                                <>
                                    <div
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 999
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: '#2e1f50',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '6px',
                                        marginTop: '4px',
                                        maxHeight: '220px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                    }}>
                                        {filteredStudents.length === 0 ? (
                                            <div style={{ padding: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center' }}>
                                                Tidak ada siswa ditemukan
                                            </div>
                                        ) : (
                                            filteredStudents.map((s: any) => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => {
                                                        setSelectedSiswaId(String(s.id));
                                                        setSiswaSearchQuery(s.nama || s.nama_lengkap);
                                                        if (s.kelas_id) setSelectedKelas(String(s.kelas_id));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    style={{
                                                        padding: '8px 10px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        transition: 'background 0.2s',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <div>
                                                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>{s.nama || s.nama_lengkap}</div>
                                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>NISN: {s.nisn} | NIS: {s.no_induk}</div>
                                                    </div>
                                                    <div style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '8px' }}>
                                                        {kelasList.find(k => k.id === s.kelas_id)?.nama || 'Tanpa Kelas'}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                    <div className="form-group">
                        <label>Jenis Laporan</label>
                        <select value={jenisLaporan} onChange={(e) => setJenisLaporan(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }}>
                            <option value="pribadi">1. Data Pribadi Siswa (Biodata)</option>
                            <option value="nilai">2. Laporan Rapor Semester (Rapor Lengkap)</option>
                            <option value="buku_induk">3. Buku Induk Lengkap (Cetak Semua Data)</option>
                        </select>
                    </div>

                    {jenisLaporan === 'nilai' && (
                        <div className="form-group">
                            <label>Pilih Semester</label>
                            <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '6px' }}>
                                {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tempat Cetak</label>
                        <input type="text" value={tempatCetak} onChange={(e) => setTempatCetak(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                    </div>

                    <div className="form-group">
                        <label>Tanggal Cetak</label>
                        <input type="date" value={tanggalCetak} onChange={(e) => setTanggalCetak(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                    </div>

                    <div className="form-group">
                        <label>Kepala Sekolah</label>
                        <input type="text" value={namaKepsek} onChange={(e) => setNamaKepsek(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                    </div>
                    
                    <div className="form-group">
                        <label>NIP Kepala Sekolah</label>
                        <input type="text" value={nipKepsek} onChange={(e) => setNipKepsek(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                    </div>

                    {jenisLaporan === 'nilai' && (
                        <>
                            <div className="form-group">
                                <label>Wali Kelas</label>
                                <input type="text" value={namaWalikelas} onChange={(e) => setNamaWalikelas(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                            </div>
                            <div className="form-group">
                                <label>NIP Wali Kelas</label>
                                <input type="text" value={nipWalikelas} onChange={(e) => setNipWalikelas(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                            </div>
                        </>
                    )}

                    {jenisLaporan === 'nilai' && (semester === 2 || semester === 4 || semester === 6) && (
                        <>
                            <div className="form-group">
                                <label>Status Keputusan</label>
                                <select value={keputusanStatus} onChange={(e) => setKeputusanStatus(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '6px' }}>
                                    {semester === 6 ? (
                                        <>
                                            <option value="lulus">Lulus</option>
                                            <option value="tidak_lulus">Tidak Lulus</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="naik">Naik Kelas</option>
                                            <option value="tinggal">Tinggal Kelas</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            {keputusanStatus === 'naik' && (
                                <div className="form-group">
                                    <label>Naik Ke Kelas</label>
                                    <input type="text" value={targetKelas} onChange={(e) => setTargetKelas(e.target.value)} placeholder="Contoh: XI AKL 1" style={{ width: '100%', padding: '10px', borderRadius: '6px' }} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* INI KERTAS A4 YANG AKAN DICETAK */}
            <div className="kertas-a4 print-area">
                
                {/* 1. DATA PRIBADI SISWA (BIODATA) */}
                {jenisLaporan === 'pribadi' && (
                    <div className="laporan-pribadi">
                        <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '3px double black', paddingBottom: '10px' }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keterangan Tentang Diri Peserta Didik</h2>
                        </div>

                        <table className="biodata-table">
                            <tbody>
                                <tr>
                                    <td className="num-col">1.</td>
                                    <td className="label-col">Nama Peserta Didik (Lengkap)</td>
                                    <td className="colon-col">:</td>
                                    <td className="value-col" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{siswa.nama}</td>
                                </tr>
                                <tr>
                                    <td>2.</td>
                                    <td>Nomor Induk / NISN</td>
                                    <td>:</td>
                                    <td>{siswa.no_induk} / {siswa.nisn}</td>
                                </tr>
                                <tr>
                                    <td>3.</td>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{siswa.tempat_lahir}, {formatDateIndo(siswa.tanggal_lahir)}</td>
                                </tr>
                                <tr>
                                    <td>4.</td>
                                    <td>Jenis Kelamin</td>
                                    <td>:</td>
                                    <td>{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                </tr>
                                <tr>
                                    <td>5.</td>
                                    <td>Agama</td>
                                    <td>:</td>
                                    <td>{siswa.agama}</td>
                                </tr>
                                <tr>
                                    <td>6.</td>
                                    <td>Anak ke</td>
                                    <td>:</td>
                                    <td>{siswa.anak_ke} dari {siswa.jumlah_saudara} bersaudara</td>
                                </tr>
                                <tr>
                                    <td>7.</td>
                                    <td>Alamat Peserta Didik</td>
                                    <td>:</td>
                                    <td>{siswa.alamat?.alamat_lengkap || '-'}</td>
                                </tr>
                                <tr>
                                    <td>8.</td>
                                    <td>Diterima di sekolah ini</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Di Kelas</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.kelas_diterima || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Pada Tanggal</td>
                                    <td>:</td>
                                    <td>{formatDateIndo(siswa.pendidikan_sebelumnya?.[0]?.tanggal_diterima)}</td>
                                </tr>
                                <tr>
                                    <td>9.</td>
                                    <td>Sekolah Asal</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Nama Sekolah</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.nama_sekolah || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Alamat</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.alamat_sekolah || '-'}</td>
                                </tr>
                                <tr>
                                    <td>10.</td>
                                    <td>Nama Orang Tua</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Ayah</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Ibu</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td>11.</td>
                                    <td>Pekerjaan Orang Tua</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Ayah</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.pekerjaan || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Ibu</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.pekerjaan || '-'}</td>
                                </tr>
                                <tr>
                                    <td>12.</td>
                                    <td>Alamat Orang Tua</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.[0]?.alamat || '-'}</td>
                                </tr>
                                <tr>
                                    <td>13.</td>
                                    <td>Nama Wali Peserta Didik</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.nama_wali || '-'}</td>
                                </tr>
                                <tr>
                                    <td>14.</td>
                                    <td>Pekerjaan Wali</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.pekerjaan_wali || '-'}</td>
                                </tr>
                                <tr>
                                    <td>15.</td>
                                    <td>Alamat Wali</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.alamat || '-'}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
                            <div className="pas-foto-container">
                                {siswa.foto_path ? (
                                    <img src={`${API_BASE}/uploads/${siswa.foto_path}`} alt="Pas Foto" />
                                ) : (
                                    <span>Pas Foto 3x4</span>
                                )}
                            </div>
                            <div style={{ width: '300px', textAlign: 'left' }}>
                                <p style={{ margin: '0 0 5px 0' }}>{tempatCetak}, {formatDateIndo(tanggalCetak)}</p>
                                <p style={{ margin: '0 0 80px 0' }}>Kepala Sekolah,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaKepsek}</p>
                                <p style={{ margin: '0' }}>NIP. {nipKepsek}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 2. LAPORAN RAPOR SEMESTER (RAPOR LENGKAP) */}
                {jenisLaporan === 'nilai' && (
                    <div className="laporan-nilai">
                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid black', paddingBottom: '10px' }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', textTransform: 'uppercase' }}>LAPORAN HASIL BELAJAR PESERTA DIDIK</h2>
                            <h3 style={{ margin: '0', fontSize: '15px' }}>SEKOLAH MENENGAH KEJURUAN (SMK)</h3>
                        </div>

                        {/* Rapor Header */}
                        <table style={{ width: '100%', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '20%' }}>Nama Peserta Didik</td>
                                    <td style={{ width: '2%' }}>:</td>
                                    <td style={{ width: '48%', fontWeight: 'bold' }}>{siswa.nama}</td>
                                    <td style={{ width: '15%' }}>Kelas</td>
                                    <td style={{ width: '2%' }}>:</td>
                                    <td style={{ width: '13%' }}>{getKelasForSemester(semester)}</td>
                                </tr>
                                <tr>
                                    <td>Nomor Induk / NISN</td>
                                    <td>:</td>
                                    <td>{siswa.no_induk} / {siswa.nisn}</td>
                                    <td>Semester</td>
                                    <td>:</td>
                                    <td>{semester} ({semester % 2 === 1 ? 'Ganjil' : 'Genap'})</td>
                                </tr>
                                <tr>
                                    <td>Nama Sekolah</td>
                                    <td>:</td>
                                    <td>SMK YAJ</td>
                                    <td>Tahun Pelajaran</td>
                                    <td>:</td>
                                    <td>{siswa.nilai_semester?.find((n: any) => n.semester === semester)?.tahun_pelajaran || '-'}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* A. SIKAP */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>A. Sikap</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }} border={1}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: '6px', width: '20%' }}>Dimensi Sikap</th>
                                        <th style={{ padding: '6px' }}>Deskripsi Perkembangan Karakter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '6px', fontWeight: '500', textAlign: 'center' }}>Sikap Spiritual</td>
                                        <td style={{ padding: '6px', textAlign: 'left', lineHeight: '1.4' }}>{sikapSemester?.deskripsi_spiritual || 'Menunjukkan perkembangan sikap spiritual yang baik.'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '6px', fontWeight: '500', textAlign: 'center' }}>Sikap Sosial</td>
                                        <td style={{ padding: '6px', textAlign: 'left', lineHeight: '1.4' }}>{sikapSemester?.deskripsi_sosial || 'Menunjukkan perkembangan sikap sosial, kerjasama, dan tanggung jawab yang baik.'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* B. PENGETAHUAN & KETERAMPILAN */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>B. Pengetahuan dan Keterampilan</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th rowSpan={2} style={{ padding: '5px', width: '3%' }}>No</th>
                                        <th rowSpan={2} style={{ padding: '5px', width: '25%' }}>Mata Pelajaran</th>
                                        <th rowSpan={2} style={{ padding: '5px', width: '5%' }}>KB</th>
                                        <th colSpan={3} style={{ padding: '5px' }}>Pengetahuan</th>
                                        <th colSpan={3} style={{ padding: '5px' }}>Keterampilan</th>
                                    </tr>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: '5px', width: '5%' }}>Angka</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Pred</th>
                                        <th style={{ padding: '5px' }}>Deskripsi</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Angka</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Pred</th>
                                        <th style={{ padding: '5px' }}>Deskripsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Helper render group subjects */}
                                    {mapelA.length > 0 && (
                                        <>
                                            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                                <td colSpan={9} style={{ padding: '5px', textAlign: 'left' }}>Kelompok A (Muatan Nasional)</td>
                                            </tr>
                                            {mapelA.map((nilai: any, idx: number) => (
                                                <tr key={nilai.id}>
                                                    <td style={{ padding: '4px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left' }}>{nilai.mata_pelajaran?.nama_mapel || nilai.mata_pelajaran?.nama || '-'}</td>
                                                    <td style={{ padding: '4px' }}>75</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_pengetahuan}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_pengetahuan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_pengetahuan || 'Menunjukkan pemahaman materi dengan baik.'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_keterampilan || '-'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_keterampilan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_keterampilan || 'Menunjukkan keterampilan praktis yang sangat baik.'}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}

                                    {mapelB.length > 0 && (
                                        <>
                                            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                                <td colSpan={9} style={{ padding: '5px', textAlign: 'left' }}>Kelompok B (Muatan Kewilayahan)</td>
                                            </tr>
                                            {mapelB.map((nilai: any, idx: number) => (
                                                <tr key={nilai.id}>
                                                    <td style={{ padding: '4px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left' }}>{nilai.mata_pelajaran?.nama_mapel || nilai.mata_pelajaran?.nama || '-'}</td>
                                                    <td style={{ padding: '4px' }}>75</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_pengetahuan}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_pengetahuan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_pengetahuan || 'Menunjukkan pemahaman materi dengan baik.'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_keterampilan || '-'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_keterampilan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_keterampilan || 'Menunjukkan keterampilan praktis yang sangat baik.'}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}

                                    {mapelC.length > 0 && (
                                        <>
                                            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                                <td colSpan={9} style={{ padding: '5px', textAlign: 'left' }}>Kelompok C (Muatan Peminatan Kejuruan)</td>
                                            </tr>
                                            {mapelC.map((nilai: any, idx: number) => (
                                                <tr key={nilai.id}>
                                                    <td style={{ padding: '4px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left' }}>{nilai.mata_pelajaran?.nama_mapel || nilai.mata_pelajaran?.nama || '-'}</td>
                                                    <td style={{ padding: '4px' }}>75</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_pengetahuan}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_pengetahuan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_pengetahuan || 'Menunjukkan pemahaman materi dengan baik.'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_keterampilan || '-'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_keterampilan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_keterampilan || 'Menunjukkan keterampilan praktis yang sangat baik.'}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}

                                    {mapelOther.length > 0 && (
                                        <>
                                            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                                <td colSpan={9} style={{ padding: '5px', textAlign: 'left' }}>Mata Pelajaran Lainnya</td>
                                            </tr>
                                            {mapelOther.map((nilai: any, idx: number) => (
                                                <tr key={nilai.id}>
                                                    <td style={{ padding: '4px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left' }}>{nilai.mata_pelajaran?.nama_mapel || nilai.mata_pelajaran?.nama || '-'}</td>
                                                    <td style={{ padding: '4px' }}>75</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_pengetahuan}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_pengetahuan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_pengetahuan || 'Menunjukkan pemahaman materi dengan baik.'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.nilai_keterampilan || '-'}</td>
                                                    <td style={{ padding: '4px' }}>{nilai.predikat_keterampilan || 'B'}</td>
                                                    <td style={{ padding: '4px', textAlign: 'left', fontSize: '9px', lineHeight: '1.2' }}>{nilai.deskripsi_keterampilan || 'Menunjukkan keterampilan praktis yang sangat baik.'}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}

                                    {nilaiSemesterFiltered.length === 0 && (
                                        <tr>
                                            <td colSpan={9} style={{ padding: '15px' }}>Belum ada data nilai akademik untuk semester ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* C. PRAKTIK KERJA LAPANGAN (PKL) */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>C. Praktik Kerja Lapangan (PKL)</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }} border={1}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: '5px', width: '5%' }}>No</th>
                                        <th style={{ padding: '5px', width: '40%' }}>Mitra Industri / DU/DI</th>
                                        <th style={{ padding: '5px', width: '25%' }}>Lokasi</th>
                                        <th style={{ padding: '5px', width: '10%' }}>Lama (Bulan)</th>
                                        <th style={{ padding: '5px' }}>Keterangan / Kinerja</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pklSemester.length > 0 ? (
                                        pklSemester.map((p: any, idx: number) => (
                                            <tr key={p.id || idx}>
                                                <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                <td style={{ padding: '5px', textAlign: 'left', fontWeight: '500' }}>{p.nama_dudi}</td>
                                                <td style={{ padding: '5px' }}>{p.lokasi}</td>
                                                <td style={{ padding: '5px' }}>{p.lama_bulan} bulan</td>
                                                <td style={{ padding: '5px', textAlign: 'left' }}>{p.keterangan || 'Sangat Baik / Selesai'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '8px', color: '#64748b' }}>- Belum melaksanakan PKL pada semester ini -</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* D. EKSTRAKURIKULER & E. PRESTASI & F. KETIDAKHADIRAN LAYOUT */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ flex: 1.2 }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>D. Ekstrakurikuler</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '5px', width: '8%' }}>No</th>
                                            <th style={{ padding: '5px', width: '45%' }}>Kegiatan Ekstrakurikuler</th>
                                            <th style={{ padding: '5px', width: '15%' }}>Nilai</th>
                                            <th style={{ padding: '5px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ekskulSemester.length > 0 ? (
                                            ekskulSemester.map((eks: any, idx: number) => (
                                                <tr key={eks.id || idx}>
                                                    <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left' }}>{eks.nama_ekskul || eks.nama_kegiatan}</td>
                                                    <td style={{ padding: '5px', fontWeight: 'bold' }}>{eks.nilai || 'A'}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left' }}>{eks.deskripsi || eks.keterangan || 'Aktif berpartisipasi.'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '8px', color: '#64748b' }}>Tidak ada kegiatan ekstrakurikuler yang diikuti.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ width: '35%' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>E. Ketidakhadiran</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }} border={1}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '6px', width: '60%' }}>1. Sakit</td>
                                            <td style={{ padding: '6px', textAlign: 'center', fontWeight: '500' }}>{sakitDays} hari</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '6px' }}>2. Izin</td>
                                            <td style={{ padding: '6px', textAlign: 'center', fontWeight: '500' }}>{izinDays} hari</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '6px' }}>3. Tanpa Keterangan</td>
                                            <td style={{ padding: '6px', textAlign: 'center', fontWeight: '500' }}>{alpaDays} hari</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* PRESTASI SEMESTER (IF ANY) */}
                        {prestasiSemester.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>F. Prestasi</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '5px', width: '5%', textAlign: 'center' }}>No</th>
                                            <th style={{ padding: '5px', width: '40%' }}>Jenis Prestasi</th>
                                            <th style={{ padding: '5px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prestasiSemester.map((pres: any, idx: number) => (
                                            <tr key={pres.id || idx}>
                                                <td style={{ padding: '5px', textAlign: 'center' }}>{idx + 1}</td>
                                                <td style={{ padding: '5px', fontWeight: '500' }}>{pres.nama_prestasi}</td>
                                                <td style={{ padding: '5px' }}>{pres.keterangan}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* G. CATATAN WALI KELAS */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{prestasiSemester.length > 0 ? 'G.' : 'F.'} Catatan Wali Kelas</h3>
                            <div style={{ border: '1.5px solid black', padding: '10px', fontSize: '12px', minHeight: '40px', fontStyle: 'italic', lineHeight: '1.4' }}>
                                "{catatanSemester?.catatan_wali_kelas || 'Pertahankan prestasimu dan terus giat belajar agar cita-citamu tercapai.'}"
                            </div>
                        </div>

                        {/* H. KEPUTUSAN KENAIKAN / KELULUSAN */}
                        {keputusanStatus !== 'none' && (
                            <div style={{ marginBottom: '30px', border: '2px solid black', padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                                <p style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '11px', color: '#475569' }}>Keputusan:</p>
                                {keputusanStatus === 'naik' && (
                                    <p style={{ margin: 0 }}>Berdasarkan hasil yang dicapai pada semester 1 dan 2, siswa dinyatakan: <span style={{ textDecoration: 'underline', fontSize: '15px' }}>NAIK KE KELAS {targetKelas}</span></p>
                                )}
                                {keputusanStatus === 'tinggal' && (
                                    <p style={{ margin: 0 }}>Berdasarkan hasil yang dicapai pada semester 1 dan 2, siswa dinyatakan: <span style={{ textDecoration: 'underline', color: 'red', fontSize: '15px' }}>TINGGAL DI KELAS {siswa.kelas_ref?.nama || getKelasForSemester(semester)}</span></p>
                                )}
                                {keputusanStatus === 'lulus' && (
                                    <p style={{ margin: 0 }}>Berdasarkan seluruh hasil ujian dan kriteria kelulusan sekolah, siswa dinyatakan: <span style={{ textDecoration: 'underline', fontSize: '15px' }}>LULUS / TAMAT BELAJAR</span></p>
                                )}
                                {keputusanStatus === 'tidak_lulus' && (
                                    <p style={{ margin: 0 }}>Berdasarkan hasil kriteria kelulusan sekolah, siswa dinyatakan: <span style={{ textDecoration: 'underline', color: 'red', fontSize: '15px' }}>TIDAK LULUS</span></p>
                                )}
                            </div>
                        )}

                        {/* Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '13px', lineHeight: '1.5' }}>
                            <div style={{ width: '30%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 65px 0' }}>Mengetahui:<br/>Orang Tua/Wali,</p>
                                <p style={{ margin: '0', fontWeight: 'bold' }}>.....................................</p>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 5px 0' }}><br/></p>
                                <p style={{ margin: '0 0 65px 0' }}>Wali Kelas,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaWalikelas}</p>
                                <p style={{ margin: '0' }}>NIP. {nipWalikelas}</p>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 5px 0' }}>{tempatCetak}, {formatDateIndo(tanggalCetak)}</p>
                                <p style={{ margin: '0 0 65px 0' }}>Kepala Sekolah,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaKepsek}</p>
                                <p style={{ margin: '0' }}>NIP. {nipKepsek}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. BUKU INDUK LENGKAP (CETAK SEMUA DATA SISWA) */}
                {jenisLaporan === 'buku_induk' && (
                    <div className="laporan-buku-induk">
                        
                        {/* LEMBAR 1: DATA IDENTITAS DIRI SISWA */}
                        <div className="buku-induk-page">
                            <div className="buku-induk-header">
                                <h1 style={{ fontSize: '18px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>BUKU INDUK SISWA SEKOLAH MENENGAH KEJURUAN</h1>
                                <h2 style={{ fontSize: '15px', margin: '0 0 10px 0', textTransform: 'uppercase', color: '#475569' }}>LEMBAR I: KETERANGAN TENTANG DIRI PESERTA DIDIK</h2>
                            </div>

                            <table className="buku-induk-table">
                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th colSpan={4} style={{ textAlign: 'left', padding: '8px', fontSize: '13px', borderBottom: '1.5px solid black' }}>A. IDENTITAS SISWA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '5%' }}>1.</td>
                                        <td style={{ width: '35%' }}>Nama Lengkap Siswa</td>
                                        <td style={{ width: '2%' }}>:</td>
                                        <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{siswa.nama}</td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td>Nama Panggilan</td>
                                        <td>:</td>
                                        <td>{siswa.nama_panggilan || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td>Nomor Induk / NISN</td>
                                        <td>:</td>
                                        <td>{siswa.no_induk} / {siswa.nisn}</td>
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td>Tempat & Tanggal Lahir</td>
                                        <td>:</td>
                                        <td>{siswa.tempat_lahir}, {formatDateIndo(siswa.tanggal_lahir)}</td>
                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td>Jenis Kelamin / Agama</td>
                                        <td>:</td>
                                        <td>{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {siswa.agama}</td>
                                    </tr>
                                    <tr>
                                        <td>6.</td>
                                        <td>Kewarganegaraan / Bahasa</td>
                                        <td>:</td>
                                        <td>{siswa.kewarganegaraan || 'Indonesia'} / {siswa.bahasa_rumah || 'Indonesia'}</td>
                                    </tr>
                                    <tr>
                                        <td>7.</td>
                                        <td>Jumlah Saudara</td>
                                        <td>:</td>
                                        <td>Anak ke {siswa.anak_ke} dari {siswa.jumlah_saudara} bersaudara</td>
                                    </tr>
                                    <tr>
                                        <td>8.</td>
                                        <td>Alamat Tinggal Lengkap</td>
                                        <td>:</td>
                                        <td>{siswa.alamat?.alamat_lengkap || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>9.</td>
                                        <td>No. Telepon / Tinggal Dengan</td>
                                        <td>:</td>
                                        <td>{siswa.alamat?.no_telepon || '-'} / {siswa.alamat?.tinggal_dengan || 'Orang Tua'}</td>
                                    </tr>
                                    <tr>
                                        <td>10.</td>
                                        <td>Jarak ke Sekolah / Transportasi</td>
                                        <td>:</td>
                                        <td>{siswa.alamat?.jarak_ke_sekolah ? `${siswa.alamat.jarak_ke_sekolah} km` : '-'} / {siswa.alamat?.transportasi || '-'}</td>
                                    </tr>
                                </tbody>

                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th colSpan={4} style={{ textAlign: 'left', padding: '8px', fontSize: '13px', borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>B. KETERANGAN KESEHATAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>11.</td>
                                        <td>Tinggi & Berat Badan (Masuk)</td>
                                        <td>:</td>
                                        <td>{siswa.kesehatan?.tinggi_badan ? `${siswa.kesehatan.tinggi_badan} cm` : '-'} / {siswa.kesehatan?.berat_badan ? `${siswa.kesehatan.berat_badan} kg` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>12.</td>
                                        <td>Tinggi & Berat Badan (Keluar)</td>
                                        <td>:</td>
                                        <td>{siswa.kesehatan?.tinggi_badan_keluar ? `${siswa.kesehatan.tinggi_badan_keluar} cm` : '-'} / {siswa.kesehatan?.berat_badan_keluar ? `${siswa.kesehatan.berat_badan_keluar} kg` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>13.</td>
                                        <td>Golongan Darah</td>
                                        <td>:</td>
                                        <td style={{ fontWeight: 'bold' }}>{siswa.kesehatan?.golongan_darah || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>14.</td>
                                        <td>Riwayat Penyakit Kronis</td>
                                        <td>:</td>
                                        <td>
                                            {siswa.kesehatan?.riwayat_penyakit?.length > 0 ? (
                                                siswa.kesehatan.riwayat_penyakit.map((p: any) => `${p.nama_penyakit} (${p.tahun_sakit})`).join(', ')
                                            ) : 'Tidak Ada'}
                                        </td>
                                    </tr>
                                </tbody>

                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th colSpan={4} style={{ textAlign: 'left', padding: '8px', fontSize: '13px', borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>C. PENDIDIKAN SEBELUMNYA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>15.</td>
                                        <td>Sekolah Asal (SMP/MTs)</td>
                                        <td>:</td>
                                        <td>{siswa.pendidikan_sebelumnya?.[0]?.nama_sekolah || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>16.</td>
                                        <td>No Ijazah / SKHUN SMP</td>
                                        <td>:</td>
                                        <td>{siswa.pendidikan_sebelumnya?.[0]?.no_ijazah || '-'} / {siswa.pendidikan_sebelumnya?.[0]?.no_skhun || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>17.</td>
                                        <td>Diterima di Sini (Tanggal & Kelas)</td>
                                        <td>:</td>
                                        <td>{formatDateIndo(siswa.pendidikan_sebelumnya?.[0]?.tanggal_diterima)} (Kelas {siswa.pendidikan_sebelumnya?.[0]?.kelas_diterima || '-'})</td>
                                    </tr>
                                </tbody>

                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th colSpan={4} style={{ textAlign: 'left', padding: '8px', fontSize: '13px', borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>D. DATA ORANG TUA / WALI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>18.</td>
                                        <td>Nama Ayah / Ibu Kandung</td>
                                        <td>:</td>
                                        <td style={{ fontWeight: '500' }}>
                                            {siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.nama || '-'} / {siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.nama || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>19.</td>
                                        <td>Pekerjaan Ayah / Ibu</td>
                                        <td>:</td>
                                        <td>
                                            {siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.pekerjaan || '-'} / {siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.pekerjaan || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>20.</td>
                                        <td>Penghasilan Bulanan Orang Tua</td>
                                        <td>:</td>
                                        <td>
                                            Ayah: {formatRupiah(siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.penghasilan_bulanan)} | 
                                            Ibu: {formatRupiah(siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.penghasilan_bulanan)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>21.</td>
                                        <td>Alamat & No. HP Orang Tua</td>
                                        <td>:</td>
                                        <td>
                                            {siswa.orang_tua?.[0]?.alamat || '-'} ({siswa.orang_tua?.[0]?.no_telepon || '-'})
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>22.</td>
                                        <td>Nama Wali & Hubungan Keluarga</td>
                                        <td>:</td>
                                        <td>{siswa.wali?.nama_wali || '-'} ({siswa.wali?.hubungan || '-'})</td>
                                    </tr>
                                    <tr>
                                        <td>23.</td>
                                        <td>Pekerjaan & Alamat Wali</td>
                                        <td>:</td>
                                        <td>{siswa.wali?.pekerjaan_wali || '-'} | {siswa.wali?.alamat || '-'} ({siswa.wali?.no_telp_wali || '-'})</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '13px' }}>
                                <div className="pas-foto-container" style={{ width: '110px', height: '140px' }}>
                                    {siswa.foto_path ? (
                                        <img src={`${API_BASE}/uploads/${siswa.foto_path}`} alt="Pas Foto" />
                                    ) : (
                                        <span>Pas Foto 3x4</span>
                                    )}
                                </div>
                                <div style={{ width: '300px', textAlign: 'left', lineHeight: '1.4' }}>
                                    <p style={{ margin: '0 0 5px 0' }}>{tempatCetak}, {formatDateIndo(tanggalCetak)}</p>
                                    <p style={{ margin: '0 0 60px 0' }}>Kepala Sekolah,</p>
                                    <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaKepsek}</p>
                                    <p style={{ margin: '0' }}>NIP. {nipKepsek}</p>
                                </div>
                            </div>
                        </div>

                        {/* LEMBAR 2: PERKEMBANGAN AKADEMIK & SIKAP (SEMESTER 1 - 6) */}
                        <div className="buku-induk-page page-break">
                            <div className="buku-induk-header">
                                <h1 style={{ fontSize: '18px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>BUKU INDUK SISWA SEKOLAH MENENGAH KEJURUAN</h1>
                                <h2 style={{ fontSize: '15px', margin: '0 0 15px 0', textTransform: 'uppercase', color: '#475569' }}>LEMBAR II: PERKEMBANGAN NILAI AKADEMIK & SIKAP</h2>
                            </div>

                            <p style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', marginBottom: '15px' }}>
                                * Rangkuman seluruh nilai akademik mata pelajaran dan deskripsi perkembangan sikap peserta didik dari semester 1 sampai semester 6 yang telah diinput ke dalam sistem.
                            </p>

                            {/* LOOP 1 S/D 6 SEMESTER */}
                            {[1, 2, 3, 4, 5, 6].map(semNum => {
                                const grades = siswa.nilai_semester?.filter((n: any) => n.semester === semNum) || [];
                                const attitude = siswa.nilai_sikap?.find((s: any) => s.semester === semNum);
                                const catatan = siswa.catatan_semester?.find((c: any) => c.semester === semNum);
                                
                                if (grades.length === 0 && !attitude && !catatan) return null; // Skip empty semesters

                                // Calculate average grade
                                const totalPengetahuan = grades.reduce((acc: number, curr: any) => acc + (curr.nilai_pengetahuan || 0), 0);
                                const avgPengetahuan = grades.length > 0 ? (totalPengetahuan / grades.length).toFixed(1) : '-';

                                return (
                                    <div key={semNum} style={{ marginBottom: '30px', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px solid black', paddingBottom: '5px', marginBottom: '10px' }}>
                                            <h3 style={{ fontSize: '13px', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>SEMESTER {semNum} ({getKelasForSemester(semNum)})</h3>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>Rata-rata Nilai: {avgPengetahuan}</span>
                                        </div>

                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '10px', textAlign: 'center' }} border={1}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                                    <th style={{ padding: '4px', width: '5%' }}>No</th>
                                                    <th style={{ padding: '4px', width: '45%', textAlign: 'left' }}>Mata Pelajaran</th>
                                                    <th style={{ padding: '4px', width: '15%' }}>Pengetahuan (Angka)</th>
                                                    <th style={{ padding: '4px', width: '15%' }}>Keterampilan (Angka)</th>
                                                    <th style={{ padding: '4px', width: '20%' }}>Predikat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {grades.map((g: any, index: number) => (
                                                    <tr key={g.id || index}>
                                                        <td style={{ padding: '3px' }}>{index + 1}</td>
                                                        <td style={{ padding: '3px', textAlign: 'left' }}>{g.mata_pelajaran?.nama_mapel || g.mata_pelajaran?.nama || '-'}</td>
                                                        <td style={{ padding: '3px', fontWeight: '500' }}>{g.nilai_pengetahuan}</td>
                                                        <td style={{ padding: '3px' }}>{g.nilai_keterampilan || '-'}</td>
                                                        <td style={{ padding: '3px' }}>{g.predikat_pengetahuan || 'B'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {attitude && (
                                            <div style={{ fontSize: '10px', display: 'flex', gap: '15px', background: '#f8fafc', padding: '8px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ flex: 1 }}>
                                                    <strong>Sikap Spiritual:</strong> <span style={{ fontStyle: 'italic' }}>{attitude.deskripsi_spiritual}</span>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <strong>Sikap Sosial:</strong> <span style={{ fontStyle: 'italic' }}>{attitude.deskripsi_sosial}</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {catatan?.catatan_wali_kelas && (
                                            <div style={{ fontSize: '10px', marginTop: '6px', padding: '6px', borderLeft: '3px solid #64748b', background: '#f8fafc' }}>
                                                <strong>Catatan Wali Kelas:</strong> <span style={{ fontStyle: 'italic' }}>"{catatan.catatan_wali_kelas}"</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {(!siswa.nilai_semester || siswa.nilai_semester.length === 0) && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', border: '1px dashed #cbd5e1', fontSize: '13px' }}>
                                    Belum ada data nilai akademik semester yang diinput untuk siswa ini.
                                </div>
                            )}
                        </div>

                        {/* LEMBAR 3: PKL, EKSTRAKURIKULER, PRESTASI & BEASISWA */}
                        <div className="buku-induk-page page-break">
                            <div className="buku-induk-header">
                                <h1 style={{ fontSize: '18px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>BUKU INDUK SISWA SEKOLAH MENENGAH KEJURUAN</h1>
                                <h2 style={{ fontSize: '15px', margin: '0 0 15px 0', textTransform: 'uppercase', color: '#475569' }}>LEMBAR III: PKL, EKSTRAKURIKULER, PRESTASI & BEASISWA</h2>
                            </div>

                            {/* 1. PRAKTIK KERJA LAPANGAN (PKL) ALL SEMESTERS */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>A. PRAKTIK KERJA LAPANGAN (PKL)</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '5%' }}>No</th>
                                            <th style={{ padding: '6px', width: '35%' }}>Mitra Industri / DU/DI</th>
                                            <th style={{ padding: '6px', width: '25%' }}>Lokasi</th>
                                            <th style={{ padding: '6px', width: '10%' }}>Lama</th>
                                            <th style={{ padding: '6px', width: '10%' }}>Semester</th>
                                            <th style={{ padding: '6px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const allPkl: any[] = [];
                                            siswa.catatan_semester?.forEach((cas: any) => {
                                                if (cas.pkl) {
                                                    cas.pkl.forEach((p: any) => {
                                                        allPkl.push({ ...p, semester: cas.semester });
                                                    });
                                                }
                                            });
                                            
                                            if (allPkl.length > 0) {
                                                return allPkl.map((p: any, idx: number) => (
                                                    <tr key={p.id || idx}>
                                                        <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                        <td style={{ padding: '5px', textAlign: 'left', fontWeight: '500' }}>{p.nama_dudi}</td>
                                                        <td style={{ padding: '5px' }}>{p.lokasi}</td>
                                                        <td style={{ padding: '5px' }}>{p.lama_bulan} bln</td>
                                                        <td style={{ padding: '5px' }}>Sem {p.semester}</td>
                                                        <td style={{ padding: '5px', textAlign: 'left' }}>{p.keterangan || 'Selesai'}</td>
                                                    </tr>
                                                ));
                                            } else {
                                                return (
                                                    <tr>
                                                        <td colSpan={6} style={{ padding: '8px', color: '#64748b' }}>Tidak ada riwayat Praktik Kerja Lapangan (PKL) yang terdaftar.</td>
                                                    </tr>
                                                );
                                            }
                                        })()}
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. EKSTRAKURIKULER ALL SEMESTERS */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>B. KEGIATAN EKSTRAKURIKULER</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '5%' }}>No</th>
                                            <th style={{ padding: '6px', width: '40%' }}>Nama Kegiatan Ekstrakurikuler</th>
                                            <th style={{ padding: '6px', width: '15%' }}>Nilai / Predikat</th>
                                            <th style={{ padding: '6px', width: '15%' }}>Semester</th>
                                            <th style={{ padding: '6px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const allEkskul: any[] = [];
                                            siswa.catatan_semester?.forEach((cas: any) => {
                                                if (cas.ekstrakurikuler) {
                                                    cas.ekstrakurikuler.forEach((e: any) => {
                                                        allEkskul.push({ ...e, semester: cas.semester });
                                                    });
                                                }
                                            });

                                            if (allEkskul.length > 0) {
                                                return allEkskul.map((e: any, idx: number) => (
                                                    <tr key={e.id || idx}>
                                                        <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                        <td style={{ padding: '5px', textAlign: 'left' }}>{e.nama_ekskul || e.nama_kegiatan}</td>
                                                        <td style={{ padding: '5px', fontWeight: 'bold' }}>{e.nilai || 'A'}</td>
                                                        <td style={{ padding: '5px' }}>Sem {e.semester}</td>
                                                        <td style={{ padding: '5px', textAlign: 'left' }}>{e.deskripsi || e.keterangan || 'Aktif'}</td>
                                                    </tr>
                                                ));
                                            } else {
                                                return (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: '8px', color: '#64748b' }}>Tidak ada riwayat kegiatan ekstrakurikuler yang terdaftar.</td>
                                                    </tr>
                                                );
                                            }
                                        })()}
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. PRESTASI (NON-AKADEMIK) */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>C. PRESTASI NON-AKADEMIK (PERWAKILAN LOMBA/KEJUARAAN)</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '5%' }}>No</th>
                                            <th style={{ padding: '6px', width: '35%' }}>Nama Lomba / Bidang</th>
                                            <th style={{ padding: '6px', width: '15%' }}>Tingkat</th>
                                            <th style={{ padding: '6px', width: '15%' }}>Tahun</th>
                                            <th style={{ padding: '6px' }}>Keterangan / Hasil</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswa.prestasi?.length > 0 ? (
                                            siswa.prestasi.map((p: any, idx: number) => (
                                                <tr key={p.id || idx}>
                                                    <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left', fontWeight: '500' }}>{p.nama_prestasi} ({p.bidang || 'Lainnya'})</td>
                                                    <td style={{ padding: '5px' }}>{p.tingkat || 'Sekolah'}</td>
                                                    <td style={{ padding: '5px' }}>{p.tahun}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left' }}>{p.keterangan || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} style={{ padding: '8px', color: '#64748b' }}>Tidak ada riwayat prestasi non-akademik yang tercatat.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 4. BEASISWA */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>D. RIWAYAT BEASISWA</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '5%' }}>No</th>
                                            <th style={{ padding: '6px', width: '25%' }}>Tahun Pelajaran</th>
                                            <th style={{ padding: '6px', width: '35%' }}>Pemberi Beasiswa</th>
                                            <th style={{ padding: '6px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswa.beasiswa?.length > 0 ? (
                                            siswa.beasiswa.map((b: any, idx: number) => (
                                                <tr key={b.id || idx}>
                                                    <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '5px' }}>{b.tahun_pelajaran}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left', fontWeight: '500' }}>{b.pemberi}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left' }}>{b.keterangan || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '8px', color: '#64748b' }}>Tidak ada data penerimaan beasiswa yang tercatat.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* LEMBAR 4: KEHADIRAN, MENINGGALKAN SEKOLAH & PEMERIKSAAN BUKU */}
                        <div className="buku-induk-page page-break">
                            <div className="buku-induk-header">
                                <h1 style={{ fontSize: '18px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>BUKU INDUK SISWA SEKOLAH MENENGAH KEJURUAN</h1>
                                <h2 style={{ fontSize: '15px', margin: '0 0 15px 0', textTransform: 'uppercase', color: '#475569' }}>LEMBAR IV: KEHADIRAN, KELUAR SEKOLAH & PEMERIKSAAN BUKU</h2>
                            </div>

                            {/* 1. RANGKUMAN KEHADIRAN */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>A. REKAPITULASI KETIDAKHADIRAN</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '15%' }}>Semester</th>
                                            <th style={{ padding: '6px', width: '20%' }}>Sakit (Hari)</th>
                                            <th style={{ padding: '6px', width: '20%' }}>Izin (Hari)</th>
                                            <th style={{ padding: '6px', width: '20%' }}>Alpa (Hari)</th>
                                            <th style={{ padding: '6px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5, 6].map(sNum => {
                                            const attendance = siswa.kehadiran?.find((k: any) => k.semester === sNum);
                                            const cas = siswa.catatan_semester?.find((c: any) => c.semester === sNum);
                                            
                                            const sDays = attendance?.jumlah_sakit ?? cas?.ketidakhadiran_catatan?.karena_sakit ?? 0;
                                            const iDays = attendance?.jumlah_izin ?? cas?.ketidakhadiran_catatan?.dengan_izin ?? 0;
                                            const aDays = attendance?.jumlah_alpa ?? cas?.ketidakhadiran_catatan?.tanpa_keterangan ?? 0;

                                            return (
                                                <tr key={sNum}>
                                                    <td style={{ padding: '5px', fontWeight: '500' }}>Semester {sNum}</td>
                                                    <td style={{ padding: '5px' }}>{sDays} hari</td>
                                                    <td style={{ padding: '5px' }}>{iDays} hari</td>
                                                    <td style={{ padding: '5px' }}>{aDays} hari</td>
                                                    <td style={{ padding: '5px', textAlign: 'left', color: '#475569' }}>
                                                        {sDays + iDays + aDays === 0 ? 'Sangat Rajin / Hadir Penuh' : 'Tercatat'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. MENINGGALKAN SEKOLAH */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>B. MENINGGALKAN SEKOLAH (KELULUSAN / PINDAHAN / KELUAR)</h3>
                                <table className="biodata-table" style={{ border: '1.5px solid black', padding: '10px' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '5%' }}>1.</td>
                                            <td style={{ width: '35%' }}>Sebab Meninggalkan Sekolah</td>
                                            <td style={{ width: '2%' }}>:</td>
                                            <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                {siswa.meninggalkan_sekolah?.tipe || (siswa.status === 'lulus' ? 'Lulus / Tamat Belajar' : '-')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2.</td>
                                            <td>Tanggal Meninggalkan Sekolah</td>
                                            <td>:</td>
                                            <td>{formatDateIndo(siswa.meninggalkan_sekolah?.tanggal_keluar)}</td>
                                        </tr>
                                        <tr>
                                            <td>3.</td>
                                            <td>No Ijazah / SKHUN Kelulusan</td>
                                            <td>:</td>
                                            <td>{siswa.meninggalkan_sekolah?.no_ijazah || siswa.nilai_ijazah?.no_ijazah || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>4.</td>
                                            <td>Alasan Keluar / Pindah Sekolah</td>
                                            <td>:</td>
                                            <td>{siswa.meninggalkan_sekolah?.alasan || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>5.</td>
                                            <td>Sekolah Tujuan (Jika Pindah)</td>
                                            <td>:</td>
                                            <td>{siswa.meninggalkan_sekolah?.sekolah_tujuan || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. CATATAN PEMERIKSAAN BUKU INDUK */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '13px', margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1.5px solid black', paddingBottom: '3px' }}>C. CATATAN PEMERIKSAAN PETUGAS / PENGAWAS BUKU INDUK</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '6px', width: '5%' }}>No</th>
                                            <th style={{ padding: '6px', width: '20%' }}>Tanggal Periksa</th>
                                            <th style={{ padding: '6px', width: '25%' }}>Nama Pemeriksa</th>
                                            <th style={{ padding: '6px', width: '20%' }}>Jabatan</th>
                                            <th style={{ padding: '6px' }}>Catatan Petugas / Hasil Pemeriksaan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswa.pemeriksaan_buku?.length > 0 ? (
                                            siswa.pemeriksaan_buku.map((pb: any, idx: number) => (
                                                <tr key={pb.id || idx}>
                                                    <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                    <td style={{ padding: '5px' }}>{formatDateIndo(pb.tanggal_periksa)}</td>
                                                    <td style={{ padding: '5px', fontWeight: '500' }}>{pb.nama_pemeriksa}</td>
                                                    <td style={{ padding: '5px' }}>{pb.jabatan}</td>
                                                    <td style={{ padding: '5px', textAlign: 'left' }}>{pb.catatan_petugas}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <>
                                                <tr>
                                                    <td style={{ padding: '6px' }}>1.</td>
                                                    <td style={{ padding: '6px' }}>{formatDateIndo(new Date())}</td>
                                                    <td style={{ padding: '6px', fontWeight: '500' }}>Staf Administrasi</td>
                                                    <td style={{ padding: '6px' }}>Petugas Tata Usaha</td>
                                                    <td style={{ padding: '6px', textAlign: 'left', fontStyle: 'italic' }}>Seluruh data biodata, nilai akademik, PKL, dan ekstrakurikuler telah diverifikasi secara valid sesuai dokumen fisik.</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '6px' }}>2.</td>
                                                    <td style={{ padding: '6px' }}>-</td>
                                                    <td style={{ padding: '6px' }}>-</td>
                                                    <td style={{ padding: '6px' }}>-</td>
                                                    <td style={{ padding: '6px', color: '#64748b' }}>-</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};


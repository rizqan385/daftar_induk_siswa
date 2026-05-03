import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const inputStyle: React.CSSProperties = {
    padding: '9px 13px', borderRadius: '8px', border: '1px solid var(--border)',
    background: '#ffffff !important', color: 'var(--text-primary)', width: '100%', fontSize: '0.875rem',
    fontFamily: 'inherit', outline: 'none'
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="app-layout">
        <Sidebar />
        <div className="main-content">
            <Navbar />
            <main className="page-wrapper fade-in">{children}</main>
        </div>
    </div>
);

// ===================== BEASISWA =====================
export const BeasiswaPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [newData, setNewData] = useState({ siswa_id: '', tahun_pelajaran: '2024/2025', pemberi: '', keterangan: '' });
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/siswa?page=1&page_size=200');
            const list = res.data.data || [];
            setSiswaList(list);
            const all: any[] = [];
            for (const s of list) {
                try {
                    const d = await api.get(`/siswa/${s.id}`);
                    (d.data.data?.beasiswa || []).forEach((b: any) =>
                        all.push({ ...b, siswa_id: s.id, siswa_nama: s.nama_lengkap, siswa_nisn: s.nisn })
                    );
                } catch (e) { /* skip */ }
            }
            setData(all);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        if (!newData.siswa_id) { alert('Pilih siswa terlebih dahulu'); return; }
        setSaving(true);
        try {
            const payload = {
                tahun_pelajaran: newData.tahun_pelajaran,
                pemberi: newData.pemberi,
                keterangan: newData.keterangan
            };
            if (isEditing && editId) {
                await api.put(`/beasiswa/${editId}`, payload);
            } else {
                await api.post(`/siswa/${newData.siswa_id}/beasiswa`, payload);
            }
            setNewData({ siswa_id: '', tahun_pelajaran: '2024/2025', pemberi: '', keterangan: '' });
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            fetchData();
        } catch (e: any) { alert('Gagal: ' + (e.response?.data?.message || e.message)); }
        setSaving(false);
    };

    const handleEdit = (b: any) => {
        setNewData({
            siswa_id: b.siswa_id,
            tahun_pelajaran: b.tahun_pelajaran || '',
            pemberi: b.pemberi || '',
            keterangan: b.keterangan || ''
        });
        setIsEditing(true);
        setEditId(b.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus data beasiswa ini?')) return;
        try {
            await api.delete(`/beasiswa/${id}`);
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <PageWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>🎓 Data Beasiswa</h2>
                <button onClick={() => {
                    if (showForm) {
                        setShowForm(false);
                        setIsEditing(false);
                        setEditId(null);
                        setNewData({ siswa_id: '', tahun_pelajaran: '2024/2025', pemberi: '', keterangan: '' });
                    } else {
                        setShowForm(true);
                    }
                }} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? 'Batal' : '+ Tambah Beasiswa'}
                </button>
            </div>
            {showForm && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Siswa</label>
                            <select value={newData.siswa_id} onChange={e => setNewData({ ...newData, siswa_id: e.target.value })} style={inputStyle} disabled={isEditing}>
                                <option value="">Pilih Siswa</option>
                                {siswaList.map((s: any) => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Tahun Pelajaran</label>
                            <input value={newData.tahun_pelajaran} onChange={e => setNewData({ ...newData, tahun_pelajaran: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Pemberi</label>
                            <input value={newData.pemberi} onChange={e => setNewData({ ...newData, pemberi: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Keterangan</label>
                            <input value={newData.keterangan} onChange={e => setNewData({ ...newData, keterangan: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            {saving ? 'Menyimpan...' : '💾 Simpan'}
                        </button>
                    </div>
                </div>
            )}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama Siswa', 'NISN', 'Tahun Pelajaran', 'Pemberi', 'Keterangan', 'Aksi'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data beasiswa</td></tr>
                        ) : data.map((b, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{b.siswa_nama}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{b.siswa_nisn}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{b.tahun_pelajaran || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{b.pemberi || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{b.keterangan || '-'}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(b)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(b.id)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

// ===================== EKSTRAKURIKULER =====================
// ===================== EKSTRAKURIKULER =====================
export const EkstrakurikulerPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [newData, setNewData] = useState({
        siswa_id: '',
        nama_kegiatan: '', keterangan: ''
    });
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resSiswa = await api.get('/siswa?page=1&page_size=200');
            setSiswaList(resSiswa.data.data || []);
            
            const resEkskul = await api.get('/keanggotaan-ekskul');
            setData(resEkskul.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!newData.siswa_id || !newData.nama_kegiatan) {
            alert('Pilih siswa dan isi nama kegiatan'); return;
        }
        setSaving(true);
        try {
            if (isEditing && editId) {
                await api.put(`/keanggotaan-ekskul/${editId}`, {
                    siswa_id: Number(newData.siswa_id),
                    nama_kegiatan: newData.nama_kegiatan,
                    keterangan: newData.keterangan
                });
            } else {
                await api.post(`/keanggotaan-ekskul`, {
                    siswa_id: Number(newData.siswa_id),
                    nama_kegiatan: newData.nama_kegiatan,
                    keterangan: newData.keterangan
                });
            }
            setNewData({ siswa_id: '', nama_kegiatan: '', keterangan: '' });
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            fetchData();
        } catch (e: any) { alert('Gagal: ' + (e.response?.data?.message || e.response?.data?.data || e.message)); }
        setSaving(false);
    };

    const handleEdit = (e: any) => {
        setNewData({
            siswa_id: e.siswa_id || '',
            nama_kegiatan: e.nama_kegiatan || '',
            keterangan: e.keterangan || ''
        });
        setIsEditing(true);
        setEditId(e.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus data ekstrakurikuler ini?')) return;
        try {
            await api.delete(`/keanggotaan-ekskul/${id}`);
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <PageWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>⚽ Kegiatan Ekstrakurikuler</h2>
                <button onClick={() => {
                    if (showForm) {
                        setShowForm(false);
                        setIsEditing(false);
                        setEditId(null);
                        setNewData({ siswa_id: '', nama_kegiatan: '', keterangan: '' });
                    } else {
                        setShowForm(true);
                    }
                }} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? 'Batal' : '+ Tambah Ekskul'}
                </button>
            </div>
            {showForm && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Siswa</label>
                            <select value={newData.siswa_id} onChange={e => setNewData({ ...newData, siswa_id: e.target.value })} style={inputStyle} disabled={isEditing}>
                                <option value="">Pilih Siswa</option>
                                {siswaList.map((s: any) => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Nama Kegiatan *</label>
                            <input value={newData.nama_kegiatan} onChange={e => setNewData({ ...newData, nama_kegiatan: e.target.value })} placeholder="Contoh: Pramuka" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Keterangan</label>
                            <input value={newData.keterangan} onChange={e => setNewData({ ...newData, keterangan: e.target.value })} placeholder="Aktif / Baik" style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            {saving ? 'Menyimpan...' : '💾 Simpan'}
                        </button>
                    </div>
                </div>
            )}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama Siswa', 'Kelas', 'Jenis Kegiatan', 'Keterangan', 'Aksi'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data ekstrakurikuler</td></tr>
                        ) : data.map((e, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{e.siswa_nama}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{e.siswa_kelas || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{e.nama_kegiatan || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{e.keterangan || '-'}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(e)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(e.id)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

// ===================== PKL =====================
export const PKLPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [newData, setNewData] = useState({
        siswa_id: '', kelas: 'XI' as 'X' | 'XI' | 'XII', semester: 3,
        nama_dudi: '', lokasi: '', lama_bulan: 3, keterangan: ''
    });
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/siswa?page=1&page_size=200');
            const list = res.data.data || [];
            setSiswaList(list);
            const all: any[] = [];
            for (const s of list) {
                try {
                    const d = await api.get(`/siswa/${s.id}`);
                    const catSem = d.data.data?.catatan_semester || [];
                    for (const c of catSem) {
                        (c.pkl || []).forEach((p: any) =>
                            all.push({ ...p, siswa_id: s.id, siswa_nama: s.nama_lengkap, kelas: c.kelas, semester: c.semester })
                        );
                    }
                } catch (e) { /* skip */ }
            }
            setData(all);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        if (!newData.siswa_id || !newData.nama_dudi) {
            alert('Pilih siswa dan isi nama DUDI (tempat PKL)'); return;
        }
        setSaving(true);
        try {
            if (isEditing && editId) {
                await api.put(`/pkl/${editId}`, {
                    nama_dudi: newData.nama_dudi,
                    lokasi: newData.lokasi,
                    lama_bulan: Number(newData.lama_bulan) || 3,
                    keterangan: newData.keterangan
                });
            } else {
                const catatanRes = await api.post(`/siswa/${newData.siswa_id}/catatan-semester`, {
                    kelas: newData.kelas,
                    semester: Number(newData.semester),
                    catatan_wali_kelas: ''
                });
                const catatanId = catatanRes.data.data?.id;
                if (!catatanId) throw new Error('Gagal membuat catatan semester');

                await api.post(`/catatan-semester/${catatanId}/pkl`, {
                    nama_dudi: newData.nama_dudi,
                    lokasi: newData.lokasi,
                    lama_bulan: Number(newData.lama_bulan) || 3,
                    keterangan: newData.keterangan
                });
            }
            setNewData({ siswa_id: '', kelas: 'XI', semester: 3, nama_dudi: '', lokasi: '', lama_bulan: 3, keterangan: '' });
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            fetchData();
        } catch (e: any) { alert('Gagal: ' + (e.response?.data?.message || e.response?.data?.data || e.message)); }
        setSaving(false);
    };

    const handleEdit = (p: any) => {
        setNewData({
            siswa_id: p.siswa_id || '',
            kelas: p.kelas || 'XI',
            semester: p.semester || 3,
            nama_dudi: p.nama_dudi || '',
            lokasi: p.lokasi || '',
            lama_bulan: p.lama_bulan || 3,
            keterangan: p.keterangan || ''
        });
        setIsEditing(true);
        setEditId(p.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus data PKL ini?')) return;
        try {
            await api.delete(`/pkl/${id}`);
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <PageWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>🏭 Praktik Kerja Lapangan (PKL)</h2>
                <button onClick={() => {
                    if (showForm) {
                        setShowForm(false);
                        setIsEditing(false);
                        setEditId(null);
                        setNewData({ siswa_id: '', kelas: 'XI', semester: 3, nama_dudi: '', lokasi: '', lama_bulan: 3, keterangan: '' });
                    } else {
                        setShowForm(true);
                    }
                }} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {showForm ? 'Batal' : '+ Tambah PKL'}
                </button>
            </div>
            {showForm && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Siswa</label>
                            <select value={newData.siswa_id} onChange={e => setNewData({ ...newData, siswa_id: e.target.value })} style={inputStyle} disabled={isEditing}>
                                <option value="">Pilih Siswa</option>
                                {siswaList.map((s: any) => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Kelas</label>
                            <select value={newData.kelas} onChange={e => setNewData({ ...newData, kelas: e.target.value as any })} style={inputStyle} disabled={isEditing}>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Semester</label>
                            <select value={newData.semester} onChange={e => setNewData({ ...newData, semester: Number(e.target.value) })} style={inputStyle} disabled={isEditing}>
                                {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Nama DUDI / Tempat PKL *</label>
                            <input value={newData.nama_dudi} onChange={e => setNewData({ ...newData, nama_dudi: e.target.value })} placeholder="Contoh: PT. Teknologi Indonesia" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Lokasi</label>
                            <input value={newData.lokasi} onChange={e => setNewData({ ...newData, lokasi: e.target.value })} placeholder="Contoh: Bandung" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Lama (Bulan)</label>
                            <input type="number" value={newData.lama_bulan} onChange={e => setNewData({ ...newData, lama_bulan: Number(e.target.value) })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Keterangan</label>
                            <input value={newData.keterangan} onChange={e => setNewData({ ...newData, keterangan: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            {saving ? 'Menyimpan...' : '💾 Simpan'}
                        </button>
                    </div>
                </div>
            )}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama Siswa', 'Kelas', 'Nama DUDI', 'Lokasi', 'Lama (Bulan)', 'Keterangan', 'Aksi'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data PKL</td></tr>
                        ) : data.map((p, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{p.siswa_nama}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{p.kelas}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{p.nama_dudi || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{p.lokasi || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{p.lama_bulan || '-'}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{p.keterangan || '-'}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(p)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

// ===================== INPUT NILAI RAPOR =====================
export const InputNilaiPage = () => {
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [filterKelas, setFilterKelas] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSiswa, setSelectedSiswa] = useState<any>(null);
    const [mapelList, setMapelList] = useState<any[]>([]);
    // Baru: p_angka, p_predikat, p_deskripsi, k_angka, k_predikat, k_deskripsi, ijazah
    const [nilai, setNilai] = useState<Record<number, { 
        p_angka: string; p_predikat: string; p_deskripsi: string; 
        k_angka: string; k_predikat: string; k_deskripsi: string; 
        ijazah: string 
    }>>({});
    const [semester, setSemester] = useState(1);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [siswaRes, kelasRes, mapelRes] = await Promise.all([
                    api.get('/siswa?page=1&page_size=200'),
                    api.get('/kelas'),
                    api.get('/mata-pelajaran')
                ]);
                setSiswaList(siswaRes.data.data || []);
                setKelasList(kelasRes.data.data || []);
                setMapelList(mapelRes.data.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const filtered = filterKelas ? siswaList.filter((s: any) => String(s.kelas_id) === filterKelas) : siswaList;

    const openInputNilai = async (siswa: any, targetSemester: number = semester) => {
        setSelectedSiswa(siswa);
        // Load existing nilai
        try {
            const reqs = [api.get(`/siswa/${siswa.id}/nilai-semester`)];
            if (targetSemester === 6) {
                reqs.push(api.get(`/siswa/${siswa.id}/nilai-ijazah`));
            }

            const results = await Promise.all(reqs.map(p => p.catch(() => null)));
            const existingSemester = results[0]?.data?.data || [];
            const existingIjazah = results[1]?.data?.data || [];

            const vals: Record<number, { 
                p_angka: string; p_predikat: string; p_deskripsi: string; 
                k_angka: string; k_predikat: string; k_deskripsi: string; 
                ijazah: string 
            }> = {};
            
            // Populate Rapot values
            existingSemester.forEach((n: any) => {
                if (n.semester === targetSemester) {
                    const mapelId = n.mata_pelajaran_id || n.mata_pelajaran?.id;
                    vals[mapelId] = {
                        ...vals[mapelId],
                        // Pengetahuan
                        p_angka: String(n.nilai_pengetahuan || ''),
                        p_predikat: n.predikat_pengetahuan || '',
                        p_deskripsi: n.deskripsi_pengetahuan || '',
                        // Keterampilan
                        k_angka: String(n.nilai_keterampilan || ''),
                        k_predikat: n.predikat_keterampilan || '',
                        k_deskripsi: n.deskripsi_keterampilan || '',
                        
                        ijazah: vals[mapelId]?.ijazah || '' // Pertahankan ijazah jika sudah ada
                    };
                }
            });

            // Populate Ijazah values (only for smt 6)
            if (targetSemester === 6) {
                existingIjazah.forEach((n: any) => {
                    const mapelId = n.mata_pelajaran_id || n.mata_pelajaran?.id;
                    vals[mapelId] = {
                        ...(vals[mapelId] || { p_angka: '', p_predikat: '', p_deskripsi: '', k_angka: '', k_predikat: '', k_deskripsi: '' }),
                        ijazah: String(n.nilai_akhir || '')
                    };
                });
            }

            setNilai(vals);
        } catch (e) { setNilai({}); }
    };

    const saveNilai = async () => {
        if (!selectedSiswa) return;
        setSaving(true);
        try {
            const kelasLabel = semester <= 2 ? 'X' : semester <= 4 ? 'XI' : 'XII';
            
            // Collect APIs to post sequentially or bulkly
            for (const [mapelId, val] of Object.entries(nilai)) {
                
                // Save Rapor Semester
                if (val.p_angka || val.p_predikat || val.p_deskripsi || val.k_angka || val.k_predikat || val.k_deskripsi) {
                    await api.post(`/siswa/${selectedSiswa.id}/nilai-semester`, {
                        mata_pelajaran_id: Number(mapelId),
                        kelas: kelasLabel,
                        semester,
                        tahun_pelajaran: '2024/2025',
                        nilai_pengetahuan: Number(val.p_angka) || 0,
                        predikat_pengetahuan: val.p_predikat || '',
                        deskripsi_pengetahuan: val.p_deskripsi || '',
                        // Keterampilan
                        nilai_keterampilan: Number(val.k_angka) || 0, 
                        predikat_keterampilan: val.k_predikat || '',
                        deskripsi_keterampilan: val.k_deskripsi || ''
                    });
                }
                
                // Save Ijazah
                if (semester === 6 && val.ijazah) {
                    await api.post(`/siswa/${selectedSiswa.id}/nilai-ijazah`, {
                        mata_pelajaran_id: Number(mapelId),
                        nilai_akhir: Number(val.ijazah) || 0,
                        tahun_lulus: "2024" // dummy default year 
                    });
                }
            }
            alert('Nilai berhasil disimpan!');
        } catch (e: any) {
            alert('Gagal menyimpan: ' + (e.response?.data?.message || e.message));
        }
        setSaving(false);
    };

    return (
        <PageWrapper>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '20px' }}>📝 Input Nilai Rapor</h2>

            {selectedSiswa ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-primary)' }}>Nilai untuk: {selectedSiswa.nama_lengkap}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Semester {semester}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select value={semester} onChange={e => { const newSem = Number(e.target.value); setSemester(newSem); setNilai({}); openInputNilai(selectedSiswa, newSem); }} style={inputStyle}>
                                {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                            <button onClick={() => setSelectedSiswa(null)} style={{ padding: '10px 20px', borderRadius: '8px', background: '#6b7280', color: '#fff', border: 'none', cursor: 'pointer' }}>← Kembali</button>
                            <button onClick={saveNilai} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                {saving ? 'Menyimpan...' : '💾 Simpan Nilai'}
                            </button>
                        </div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1300px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    <th rowSpan={2} style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', width: '4%' }}>No</th>
                                    <th rowSpan={2} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', width: '8%' }}>Kode</th>
                                    <th rowSpan={2} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>Mata Pelajaran</th>
                                    <th colSpan={3} style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>Pengetahuan</th>
                                    <th colSpan={3} style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: semester === 6 ? '1px solid var(--border-color)' : 'none' }}>Keterampilan</th>
                                    {semester === 6 && (
                                        <th rowSpan={2} style={{ padding: '14px 16px', textAlign: 'center', color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Nilai Ijazah SMK</th>
                                    )}
                                </tr>
                                <tr style={{ background: 'rgba(59,130,246,0.05)' }}>
                                    {/* Subheadings for Pengetahuan */}
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', width: '80px' }}>Angka</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', width: '80px' }}>Predikat</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', width: '200px' }}>Deskripsi</th>
                                    
                                    {/* Subheadings for Keterampilan */}
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', width: '80px' }}>Angka</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', width: '80px' }}>Predikat</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderRight: semester === 6 ? '1px solid var(--border-color)' : 'none', width: '200px' }}>Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mapelList.filter((m: any) => {
                                    const studentClassName = selectedSiswa?.kelas_ref?.nama || kelasList.find((k: any) => k.id === selectedSiswa?.kelas_id)?.nama || '';
                                    return m.kelas_target_1 === 'Semua' || m.kelas_target_1 === studentClassName || m.kelas_target_2 === studentClassName;
                                }).map((m: any, i: number) => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px 16px', color: 'var(--text-primary)', borderRight: '1px solid var(--border-color)', textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ padding: '10px 16px', color: '#3b82f6', fontWeight: 600, borderRight: '1px solid var(--border-color)' }}>{m.kode}</td>
                                        <td style={{ padding: '10px 16px', color: 'var(--text-primary)', borderRight: '1px solid var(--border-color)' }}>{m.nama}</td>
                                        
                                        {/* Pengetahuan inputs */}
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <input type="number" min="0" max="100"
                                                value={nilai[m.id]?.p_angka || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], p_angka: e.target.value } })}
                                                style={{ ...inputStyle, width: '60px', padding: '6px', textAlign: 'center' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <select
                                                value={nilai[m.id]?.p_predikat || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], p_predikat: e.target.value } })}
                                                style={{ ...inputStyle, width: '60px', padding: '6px', textAlign: 'center' }}
                                            >
                                                <option value="">-</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '10px 16px', borderRight: '1px solid var(--border-color)' }}>
                                            <input type="text"
                                                value={nilai[m.id]?.p_deskripsi || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], p_deskripsi: e.target.value } })}
                                                style={{ ...inputStyle, width: '100%', minWidth: '150px', padding: '6px' }}
                                            />
                                        </td>

                                        {/* Keterampilan inputs */}
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <input type="number" min="0" max="100"
                                                value={nilai[m.id]?.k_angka || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], k_angka: e.target.value } })}
                                                style={{ ...inputStyle, width: '60px', padding: '6px', textAlign: 'center' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <select
                                                value={nilai[m.id]?.k_predikat || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], k_predikat: e.target.value } })}
                                                style={{ ...inputStyle, width: '60px', padding: '6px', textAlign: 'center' }}
                                            >
                                                <option value="">-</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '10px 16px', borderRight: semester === 6 ? '1px solid var(--border-color)' : 'none' }}>
                                            <input type="text"
                                                value={nilai[m.id]?.k_deskripsi || ''}
                                                onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], k_deskripsi: e.target.value } })}
                                                style={{ ...inputStyle, width: '100%', minWidth: '150px', padding: '6px' }}
                                            />
                                        </td>

                                        {semester === 6 && (
                                            <td style={{ padding: '10px 16px' }}>
                                                <input type="number" min="0" max="100"
                                                    value={nilai[m.id]?.ijazah || ''}
                                                    onChange={e => setNilai({ ...nilai, [m.id]: { ...nilai[m.id], ijazah: e.target.value } })}
                                                    style={{ ...inputStyle, width: '80px', borderColor: '#8b5cf6' }}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} style={{ ...inputStyle, width: '200px' }}>
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                        </select>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    {['No', 'Nama Siswa', 'NIS', 'NISN', 'Aksi'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada siswa</td></tr>
                                ) : filtered.map((s: any, i: number) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{s.nama_lengkap}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{s.no_induk}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.nisn}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button onClick={() => openInputNilai(s)} style={{ padding: '8px 16px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                                ✏️ Input Nilai
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </PageWrapper>
    );
};

// ===================== INPUT NILAI EKSKUL =====================
export const InputNilaiEkskulPage = () => {
    const [loading, setLoading] = useState(true);
    const [ekskulList, setEkskulList] = useState<any[]>([]);
    const [filterEkskulTitle, setFilterEkskulTitle] = useState('');
    const [semester, setSemester] = useState<number>(1);
    const [uniqueEkskulNames, setUniqueEkskulNames] = useState<string[]>([]);
    const [nilaiData, setNilaiData] = useState<Record<number, { id_nilai: number | null, predikat: string }>>({});
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [siswaRes, keanggotaanRes] = await Promise.all([
                api.get('/siswa?page=1&page_size=200'),
                api.get('/keanggotaan-ekskul')
            ]);
            const sList = siswaRes.data.data || [];
            const keanggotaan = keanggotaanRes.data.data || [];

            const uniqueNames = Array.from(new Set(keanggotaan.map((e: any) => e.nama_kegiatan).filter(Boolean))) as string[];
            setUniqueEkskulNames(uniqueNames.sort());

            const gradeMap: Record<string, { id_nilai: number, predikat: string }> = {};
            for (const s of sList) {
                try {
                    const d = await api.get(`/siswa/${s.id}`);
                    const catSem = d.data.data?.catatan_semester || [];
                    const c = catSem.find((cs: any) => Number(cs.semester) === semester);
                    if (c && c.ekstrakurikuler) {
                        c.ekstrakurikuler.forEach((gr: any) => {
                           gradeMap[`${s.id}_${gr.nama_kegiatan}`] = { id_nilai: gr.id, predikat: gr.nilai };
                        });
                    }
                } catch(e) {}
            }

            const initialNilaiData: any = {};
            keanggotaan.forEach((k: any) => {
                 const key = `${k.siswa_id}_${k.nama_kegiatan}`;
                 const existingGrade = gradeMap[key];
                 initialNilaiData[k.id] = { 
                     id_nilai: existingGrade ? existingGrade.id_nilai : null, 
                     predikat: existingGrade ? existingGrade.predikat : '' 
                 };
            });

            setNilaiData(initialNilaiData);
            setEkskulList(keanggotaan);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semester]);

    const predikatKeterangan = (p: string) => {
        if (p === 'A') return 'Sangat Baik';
        if (p === 'B') return 'Baik';
        if (p === 'C') return 'Cukup';
        return '-';
    };

    const filtered = ekskulList.filter((e: any) => {
        // Find matching student class info via the name mapping (as the API doesn't give class ID directly yet)
        const matchEkskul = filterEkskulTitle ? e.nama_kegiatan === filterEkskulTitle : true;
        return matchEkskul; 
        // We simplified filter to just EkskulTitle for now, as class filtering requires looking up class ID from string. 
    });

    return (
        <PageWrapper>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '20px' }}>⭐ Input Nilai Ekstrakurikuler</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Semester</label>
                    <select value={semester} onChange={e => setSemester(Number(e.target.value))} style={{ ...inputStyle, width: '120px' }}>
                        {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Filter Ekstrakurikuler</label>
                    <select value={filterEkskulTitle} onChange={e => setFilterEkskulTitle(e.target.value)} style={{ ...inputStyle, width: '200px' }}>
                        <option value="">Semua Ekskul</option>
                        {uniqueEkskulNames.map((n, idx) => <option key={idx} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>
            
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama', 'Kelas', 'Kegiatan', 'Predikat', 'Keterangan Predikat'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data Ekstrakurikuler Siswa...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada data Ekstrakurikuler yang sesuai kriteria. Pastikan siswa telah ditambahkan ke data Ekstrakurikuler pada tab Kesiswaan &gt; Ekstrakurikuler.</td></tr>
                        ) : filtered.map((item: any, i: number) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{item.siswa_nama}</td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{item.siswa_kelas}</td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{item.nama_kegiatan}</td>
                                <td style={{ padding: '10px 16px' }}>
                                    <select 
                                        value={nilaiData[item.id]?.predikat || ''} 
                                        onChange={e => setNilaiData({ ...nilaiData, [item.id]: { ...nilaiData[item.id], predikat: e.target.value } })} 
                                        style={{ ...inputStyle, width: '80px' }}
                                    >
                                        <option value="">-</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>
                                    {predikatKeterangan(nilaiData[item.id]?.predikat || '')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <button onClick={async () => {
                        setSaving(true);
                        try {
                            const modifications: Promise<any>[] = [];
                            for (const item of filtered) {
                                const localVal = nilaiData[item.id];
                                if (!localVal || !localVal.predikat) continue;

                                if (localVal.id_nilai) {
                                    modifications.push(
                                        api.put(`/ekstrakurikuler/${localVal.id_nilai}`, {
                                            nama_kegiatan: item.nama_kegiatan,
                                            nilai: localVal.predikat,
                                            keterangan: item.keterangan || ''
                                        })
                                    );
                                } else {
                                    const execCreate = async () => {
                                        const catatanRes = await api.post(`/siswa/${item.siswa_id}/catatan-semester`, {
                                            kelas: semester <= 2 ? 'X' : semester <= 4 ? 'XI' : 'XII',
                                            semester: semester,
                                            catatan_wali_kelas: ''
                                        });
                                        const catatanId = catatanRes.data.data?.id;
                                        if (catatanId) {
                                            return api.post(`/catatan-semester/${catatanId}/ekstrakurikuler`, {
                                                nama_kegiatan: item.nama_kegiatan,
                                                nilai: localVal.predikat,
                                                keterangan: item.keterangan || ''
                                            });
                                        }
                                    };
                                    modifications.push(execCreate());
                                }
                            }
                            
                            if (modifications.length === 0) {
                                alert('Tidak ada perubahan nilai yang perlu disimpan.');
                            } else {
                                await Promise.all(modifications);
                                alert('Nilai ekskul berhasil disimpan!');
                                fetchData();
                            }
                        } catch (e) { 
                            console.error(e);
                            alert('Terjadi kesalahan saat menyimpan data!');
                        }
                        setSaving(false);
                    }} disabled={saving || loading} style={{ padding: '10px 24px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
                    </button>
                </div>
            )}
        </PageWrapper>
    );
};

// ===================== INPUT KETIDAKHADIRAN =====================
export const InputKetidakhadiranPage = () => {
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [filterKelas, setFilterKelas] = useState('');
    const [semester, setSemester] = useState(1);
    const [loading, setLoading] = useState(true);
    const [kehadiranData, setKehadiranData] = useState<Record<number, { sakit: string; izin: string; alpha: string }>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [siswaRes, kelasRes] = await Promise.all([
                    api.get('/siswa?page=1&page_size=200'),
                    api.get('/kelas')
                ]);
                setSiswaList(siswaRes.data.data || []);
                setKelasList(kelasRes.data.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const filtered = filterKelas ? siswaList.filter((s: any) => String(s.kelas_id) === filterKelas) : siswaList;

    useEffect(() => {
        const fetchSiswaKehadiran = async () => {
            if (filtered.length === 0) {
                setKehadiranData({});
                return;
            }
            setLoading(true);
            const currentMap: Record<number, { sakit: string; izin: string; alpha: string }> = {};
            const kelasLabel = semester <= 2 ? 'X' : semester <= 4 ? 'XI' : 'XII';

            try {
                await Promise.all(
                    filtered.map(async (s) => {
                        try {
                            const res = await api.get(`/siswa/${s.id}/kehadiran?page=1&page_size=100`);
                            const records = res.data.data || [];
                            // Find the record that matches both exact class and semester
                            const target = records.find((r: any) => String(r.kelas) === kelasLabel && Number(r.semester) === semester);
                            if (target) {
                                currentMap[s.id] = {
                                    sakit: target.jumlah_sakit?.toString() || '',
                                    izin: target.jumlah_izin?.toString() || '',
                                    alpha: target.jumlah_alpa?.toString() || ''
                                };
                            } else {
                                currentMap[s.id] = { sakit: '', izin: '', alpha: '' };
                            }
                        } catch (e) {
                            currentMap[s.id] = { sakit: '', izin: '', alpha: '' };
                        }
                    })
                );
                setKehadiranData(currentMap);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSiswaKehadiran();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKelas, semester, siswaList.length]);

    const saveKehadiran = async () => {
        setSaving(true);
        const kelasLabel = semester <= 2 ? 'X' : semester <= 4 ? 'XI' : 'XII';
        try {
            const modifications = [];
            for (const [siswaIdStr, val] of Object.entries(kehadiranData)) {
                if (val.sakit || val.izin || val.alpha) {
                    modifications.push(
                        api.post(`/siswa/${siswaIdStr}/kehadiran`, {
                            kelas: kelasLabel,
                            semester: semester,
                            jumlah_hadir: 0,
                            persentase_hadir: 0,
                            jumlah_sakit: Number(val.sakit) || 0,
                            jumlah_izin: Number(val.izin) || 0,
                            jumlah_alpa: Number(val.alpha) || 0,
                            jumlah_hari_efektif: 0
                        })
                    );
                }
            }
            
            if (modifications.length === 0) {
                alert('Tidak ada data yang perlu disimpan.');
            } else {
                await Promise.all(modifications);
                alert('Data ketidakhadiran berhasil disimpan!');
            }
        } catch (e: any) {
            alert('Gagal: ' + (e.response?.data?.message || e.message));
        }
        setSaving(false);
    };

    return (
        <PageWrapper>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '20px' }}>📋 Input Ketidakhadiran</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'end' }}>
                <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Kelas</label>
                    <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} style={{ ...inputStyle, width: '200px' }}>
                        <option value="">Semua (Pilih Kelas)</option>
                        {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Semester</label>
                    <select value={semester} onChange={e => setSemester(Number(e.target.value))} style={{ ...inputStyle, width: '150px' }}>
                        {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>
                <button onClick={saveKehadiran} disabled={saving || !filterKelas || loading} style={{ padding: '10px 24px', borderRadius: '8px', background: filterKelas && !loading ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', cursor: filterKelas && !loading ? 'pointer' : 'not-allowed', fontWeight: 600, height: 'fit-content' }}>
                    {saving ? 'Menyimpan...' : '💾 Simpan Semua'}
                </button>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama', 'NIS', 'Sakit', 'Izin', 'Alpha'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat Data Kehadiran...</td></tr>
                        ) : !filterKelas ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Silakan Pilih Kelas Terlebih Dahulu</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada siswa di kelas ini</td></tr>
                        ) : filtered.map((s: any, i: number) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{s.nama_lengkap}</td>
                                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{s.no_induk}</td>
                                <td style={{ padding: '10px 16px' }}>
                                    <input type="number" min="0" value={kehadiranData[s.id]?.sakit || ''} onChange={e => setKehadiranData({ ...kehadiranData, [s.id]: { ...kehadiranData[s.id], sakit: e.target.value } })} style={{ ...inputStyle, width: '70px' }} />
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                    <input type="number" min="0" value={kehadiranData[s.id]?.izin || ''} onChange={e => setKehadiranData({ ...kehadiranData, [s.id]: { ...kehadiranData[s.id], izin: e.target.value } })} style={{ ...inputStyle, width: '70px' }} />
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                    <input type="number" min="0" value={kehadiranData[s.id]?.alpha || ''} onChange={e => setKehadiranData({ ...kehadiranData, [s.id]: { ...kehadiranData[s.id], alpha: e.target.value } })} style={{ ...inputStyle, width: '70px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

// ===================== KENAIKAN KELAS =====================
export const KenaikanKelasPage = () => {
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [filterKelas, setFilterKelas] = useState('');
    const [tahunBaru, setTahunBaru] = useState('2025/2026');
    const [loading, setLoading] = useState(true);
    const [excluded, setExcluded] = useState<Set<number>>(new Set());
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [siswaRes, kelasRes] = await Promise.all([
                    api.get('/siswa?page=1&page_size=200'),
                    api.get('/kelas')
                ]);
                setSiswaList(siswaRes.data.data || []);
                setKelasList(kelasRes.data.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const filtered = filterKelas ? siswaList.filter((s: any) => String(s.kelas_id) === filterKelas) : siswaList;

    const getKelasName = (kelasId: number) => kelasList.find((k: any) => k.id === kelasId)?.nama || '-';
    const getKelasTingkat = (kelasId: number) => kelasList.find((k: any) => k.id === kelasId)?.tingkat || '';

    const getStatus = (siswa: any) => {
        if (excluded.has(siswa.id)) return 'Tinggal Kelas';
        const tingkat = getKelasTingkat(siswa.kelas_id);
        if (tingkat === 'XII') return 'Lulus';
        return 'Naik Kelas';
    };

    const toggleExclude = (id: number) => {
        const next = new Set(excluded);
        if (next.has(id)) next.delete(id); else next.add(id);
        setExcluded(next);
    };

    const processKenaikan = async () => {
        if (!confirm('Proses kenaikan kelas? Aksi ini tidak dapat dibatalkan.')) return;
        setProcessing(true);
        try {
            for (const s of filtered) {
                if (excluded.has(s.id)) {
                    // Stay in same class
                    await api.put(`/siswa/${s.id}`, { status: 'tinggal_kelas' }).catch(() => { });
                } else {
                    const tingkat = getKelasTingkat(s.kelas_id);
                    if (tingkat === 'XII') {
                        // Mark as graduated via Meninggalkan Sekolah API, which automatically sets status to 'keluar'
                        await api.post(`/siswa/${s.id}/meninggalkan-sekolah`, {
                            tipe: 'tamat',
                            tanggal: new Date().toISOString().substring(0, 10),
                            alasan: `Lulus otomatis tahun ajaran ${tahunBaru}`
                        }).catch(() => { });
                    } else {
                        // Find next kelas
                        const nextTingkat = tingkat === 'X' ? 'XI' : 'XII';
                        const currentKelas = kelasList.find((k: any) => k.id === s.kelas_id);
                        const nextKelas = kelasList.find((k: any) => k.tingkat === nextTingkat && k.jurusan === currentKelas?.jurusan);
                        if (nextKelas) {
                            await api.put(`/siswa/${s.id}`, { kelas_id: nextKelas.id, status: 'aktif' }).catch(() => { });
                        }
                    }
                }
            }
            alert('Kenaikan kelas berhasil diproses!');
            window.location.reload();
        } catch (e: any) {
            alert('Gagal: ' + (e.response?.data?.message || e.message));
        }
        setProcessing(false);
    };

    return (
        <PageWrapper>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '20px' }}>📈 Kenaikan Kelas</h2>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Filter Kelas</label>
                        <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} style={{ ...inputStyle, width: '200px' }}>
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Tahun Pelajaran Baru</label>
                        <input value={tahunBaru} onChange={e => setTahunBaru(e.target.value)} style={{ ...inputStyle, width: '200px' }} />
                    </div>
                    <button onClick={processKenaikan} disabled={processing} style={{ padding: '10px 24px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, height: 'fit-content' }}>
                        {processing ? 'Memproses...' : '🚀 Proses Kenaikan'}
                    </button>
                </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                            {['No', 'Nama Siswa', 'NIS', 'Kelas Saat Ini', 'Status', 'Tinggal Kelas?'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada siswa</td></tr>
                        ) : filtered.map((s: any, i: number) => {
                            const status = getStatus(s);
                            const statusColor = status === 'Lulus' ? '#10b981' : status === 'Naik Kelas' ? '#3b82f6' : '#ef4444';
                            return (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{i + 1}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{s.nama_lengkap}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.no_induk}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{getKelasName(s.kelas_id)}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: `${statusColor}20`, color: statusColor }}>
                                            {status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {getKelasTingkat(s.kelas_id) !== 'XII' && (
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={excluded.has(s.id)} onChange={() => toggleExclude(s.id)} style={{ width: '18px', height: '18px' }} />
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tinggal</span>
                                            </label>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

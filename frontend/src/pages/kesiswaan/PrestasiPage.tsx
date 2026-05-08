import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-app)', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem'
};

const PrestasiPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [newData, setNewData] = useState({ siswa_id: '', nama_prestasi: '', bidang: 'Olahraga', tingkat: '', tahun: new Date().getFullYear(), keterangan: '' });
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/siswa?page=1&page_size=200');
            const list = res.data.data || [];
            setSiswaList(list);
            const allPrestasi: any[] = [];
            for (const s of list) {
                try {
                    const detail = await api.get(`/siswa/${s.id}`);
                    const prestasi = detail.data.data?.prestasi || [];
                    prestasi.forEach((p: any) => allPrestasi.push({ ...p, siswa_id: s.id, siswa_nama: s.nama_lengkap, siswa_nisn: s.nisn }));
                } catch (e) { /* skip */ }
            }
            setData(allPrestasi);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        if (!newData.siswa_id) { alert('Pilih siswa terlebih dahulu'); return; }
        setSaving(true);
        try {
            const payload = {
                nama_prestasi: newData.nama_prestasi,
                bidang: newData.bidang,
                tingkat: newData.tingkat,
                tahun: Number(newData.tahun) || new Date().getFullYear(),
                keterangan: newData.keterangan
            };

            if (isEditing && editId) {
                await api.put(`/prestasi/${editId}`, payload);
            } else {
                await api.post(`/siswa/${newData.siswa_id}/prestasi`, payload);
            }
            
            setNewData({ siswa_id: '', nama_prestasi: '', bidang: 'Olahraga', tingkat: '', tahun: new Date().getFullYear(), keterangan: '' });
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            fetchData();
        } catch (e: any) { alert('Gagal: ' + (e.response?.data?.message || e.message)); }
        setSaving(false);
    };

    const handleEdit = (p: any) => {
        setNewData({
            siswa_id: p.siswa_id,
            nama_prestasi: p.nama_prestasi || '',
            bidang: p.bidang || 'Olahraga',
            tingkat: p.tingkat || '',
            tahun: p.tahun || new Date().getFullYear(),
            keterangan: p.keterangan || ''
        });
        setIsEditing(true);
        setEditId(p.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus data prestasi ini?')) return;
        try {
            await api.delete(`/prestasi/${id}`);
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>🏆 Prestasi Siswa</h2>
                        <button onClick={() => {
                            if (showForm) {
                                setShowForm(false);
                                setIsEditing(false);
                                setEditId(null);
                                setNewData({ siswa_id: '', nama_prestasi: '', bidang: 'Olahraga', tingkat: '', tahun: new Date().getFullYear(), keterangan: '' });
                            } else {
                                setShowForm(true);
                            }
                        }} style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            {showForm ? 'Batal' : '+ Tambah Prestasi'}
                        </button>
                    </div>
                    {showForm && (
                        <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Siswa</label>
                                    <select value={newData.siswa_id} onChange={e => setNewData({...newData, siswa_id: e.target.value})} style={inputStyle} disabled={isEditing}>
                                        <option value="">Pilih Siswa</option>
                                        {siswaList.map((s: any) => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Nama Prestasi/Lomba *</label>
                                    <input value={newData.nama_prestasi} onChange={e => setNewData({...newData, nama_prestasi: e.target.value})} placeholder="Juara 1 Lomba Lari" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Bidang</label>
                                    <select value={newData.bidang} onChange={e => setNewData({...newData, bidang: e.target.value})} style={inputStyle}>
                                        <option value="Olahraga">Olahraga</option>
                                        <option value="Kesenian">Kesenian</option>
                                        <option value="Kemasyarakatan">Kemasyarakatan</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Tingkat</label>
                                    <input value={newData.tingkat} onChange={e => setNewData({...newData, tingkat: e.target.value})} placeholder="Kabupaten / Provinsi / Nasional" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Tahun</label>
                                    <input type="number" value={newData.tahun} onChange={e => setNewData({...newData, tahun: Number(e.target.value)})} placeholder="2024" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Keterangan Tambahan</label>
                                    <input value={newData.keterangan} onChange={e => setNewData({...newData, keterangan: e.target.value})} placeholder="Penyelenggara / Detail lainnya" style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ marginTop: '12px', textAlign: 'right' }}>
                                <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    {saving ? 'Menyimpan...' : '💾 Simpan'}
                                </button>
                            </div>
                        </div>
                    )}
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    {['No', 'Nama Siswa', 'Nama Prestasi', 'Bidang', 'Tingkat', 'Tahun', 'Keterangan', 'Aksi'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data prestasi...</td></tr>
                                ) : data.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data prestasi</td></tr>
                                ) : data.map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{i + 1}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{p.siswa_nama}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.nama_prestasi || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.bidang || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.tingkat || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.tahun || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.keterangan || '-'}</td>
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
                </main>
            </div>
        </div>
    );
};

export default PrestasiPage;

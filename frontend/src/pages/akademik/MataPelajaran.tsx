import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

interface MapelItem {
    id: number;
    kode: string;
    nama: string;
    kelompok: string;
    sub_kelompok: string;
    kelas_target_1: string;
    kelas_target_2: string;
    aktif: boolean;
}

const MataPelajaranPage = () => {
    const [mapelList, setMapelList] = useState<MapelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<MapelItem | null>(null);
    const [form, setForm] = useState({ kode: '', nama: '', kelompok: 'A', sub_kelompok: '', kelas_target_1: 'Semua', kelas_target_2: 'Tidak ada', aktif: true });

    const fetchData = async () => {
        try {
            const res = await api.get('/mata-pelajaran');
            setMapelList(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editItem) {
                await api.put(`/mata-pelajaran/${editItem.id}`, form);
            } else {
                await api.post('/mata-pelajaran', form);
            }
            setShowForm(false); setEditItem(null);
            setForm({ kode: '', nama: '', kelompok: 'A', sub_kelompok: '', kelas_target_1: 'Semua', kelas_target_2: 'Tidak ada', aktif: true });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleEdit = (m: MapelItem) => {
        setEditItem(m);
        setForm({ kode: m.kode, nama: m.nama, kelompok: m.kelompok, sub_kelompok: m.sub_kelompok || '', kelas_target_1: m.kelas_target_1 || 'Semua', kelas_target_2: m.kelas_target_2 || 'Tidak ada', aktif: m.aktif });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus mata pelajaran?')) return;
        await api.delete(`/mata-pelajaran/${id}`);
        fetchData();
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
        background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem'
    };

    const kelompokLabel = (k: string) => k === 'A' ? 'Muatan Nasional' : k === 'B' ? 'Muatan Kewilayahan' : 'Muatan Peminatan';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>📚 Mata Pelajaran</h2>
                        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({ kode: '', nama: '', kelompok: 'A', sub_kelompok: '', kelas_target_1: 'Semua', kelas_target_2: 'Tidak ada', aktif: true }); }}
                            style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            + Tambah Mapel
                        </button>
                    </div>

                    {showForm && (
                        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{editItem ? 'Edit Mapel' : 'Tambah Mapel'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Kode</label>
                                    <input value={form.kode} onChange={e => setForm({ ...form, kode: e.target.value })} placeholder="MTK" required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Nama</label>
                                    <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Matematika" required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Kelompok</label>
                                    <select value={form.kelompok} onChange={e => setForm({ ...form, kelompok: e.target.value })} style={inputStyle}>
                                        <option value="A">A - Muatan Nasional</option>
                                        <option value="B">B - Muatan Kewilayahan</option>
                                        <option value="C">C - Muatan Peminatan</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Target Kelas 1</label>
                                    <select value={form.kelas_target_1} onChange={e => setForm({ ...form, kelas_target_1: e.target.value })} style={inputStyle}>
                                        <option value="Semua">Semua</option>
                                        <option value="X TKJ">X TKJ</option>
                                        <option value="X PPLG">X PPLG</option>
                                        <option value="XI TKJ">XI TKJ</option>
                                        <option value="XI PPLG">XI PPLG</option>
                                        <option value="XII TKJ">XII TKJ</option>
                                        <option value="XII PPLG">XII PPLG</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Target Kelas 2</label>
                                    <select value={form.kelas_target_2} onChange={e => setForm({ ...form, kelas_target_2: e.target.value })} style={inputStyle}>
                                        <option value="Tidak ada">Tidak ada</option>
                                        <option value="X TKJ">X TKJ</option>
                                        <option value="X PPLG">X PPLG</option>
                                        <option value="XI TKJ">XI TKJ</option>
                                        <option value="XI PPLG">XI PPLG</option>
                                        <option value="XII TKJ">XII TKJ</option>
                                        <option value="XII PPLG">XII PPLG</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'end', gap: '8px' }}>
                                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                        {editItem ? 'Update' : 'Simpan'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', background: '#6b7280', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    {['No', 'Kode', 'Nama', 'Kelompok', 'Target Kelas', 'Aksi'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat...</td></tr>
                                ) : mapelList.map((m, i) => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{i + 1}</td>
                                        <td style={{ padding: '12px 16px', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>{m.kode}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{m.nama}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: '12px', background: m.kelompok === 'A' ? '#3b82f620' : m.kelompok === 'B' ? '#8b5cf620' : '#10b98120', color: m.kelompok === 'A' ? '#3b82f6' : m.kelompok === 'B' ? '#8b5cf6' : '#10b981' }}>
                                                {kelompokLabel(m.kelompok)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                            {m.kelas_target_1 || 'Semua'} 
                                            {m.kelas_target_2 && m.kelas_target_2 !== 'Tidak ada' ? ` & ${m.kelas_target_2}` : ''}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEdit(m)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                                <button onClick={() => handleDelete(m.id)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
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

export default MataPelajaranPage;

import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

interface Kelas {
    id: number;
    nama: string;
    tingkat: string;
    jurusan: string;
    tahun_pelajaran: string;
    wali_kelas: string;
}

const DataKelasPage = () => {
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<Kelas | null>(null);
    const [form, setForm] = useState({ nama: '', tingkat: 'X', jurusan: '', tahun_pelajaran: '2024/2025', wali_kelas: '' });

    const fetchData = async () => {
        try {
            const res = await api.get('/kelas');
            setKelasList(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editItem) {
                await api.put(`/kelas/${editItem.id}`, form);
            } else {
                await api.post('/kelas', form);
            }
            setShowForm(false);
            setEditItem(null);
            setForm({ nama: '', tingkat: 'X', jurusan: '', tahun_pelajaran: '2024/2025', wali_kelas: '' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleEdit = (k: Kelas) => {
        setEditItem(k);
        setForm({ nama: k.nama, tingkat: k.tingkat, jurusan: k.jurusan || '', tahun_pelajaran: k.tahun_pelajaran, wali_kelas: k.wali_kelas || '' });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus kelas ini?')) return;
        await api.delete(`/kelas/${id}`);
        fetchData();
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
        background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>🏫 Data Kelas</h2>
                        <button onClick={() => { setShowForm(true); setEditItem(null); setForm({ nama: '', tingkat: 'X', jurusan: '', tahun_pelajaran: '2024/2025', wali_kelas: '' }); }}
                            style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            + Tambah Kelas
                        </button>
                    </div>

                    {showForm && (
                        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{editItem ? 'Edit Kelas' : 'Tambah Kelas'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Nama Kelas</label>
                                    <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="X TKJ" required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tingkat</label>
                                    <select value={form.tingkat} onChange={e => setForm({ ...form, tingkat: e.target.value })} style={inputStyle}>
                                        <option value="X">X</option>
                                        <option value="XI">XI</option>
                                        <option value="XII">XII</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Jurusan</label>
                                    <input value={form.jurusan} onChange={e => setForm({ ...form, jurusan: e.target.value })} placeholder="TKJ" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tahun Pelajaran</label>
                                    <input value={form.tahun_pelajaran} onChange={e => setForm({ ...form, tahun_pelajaran: e.target.value })} placeholder="2024/2025" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Wali Kelas</label>
                                    <input value={form.wali_kelas} onChange={e => setForm({ ...form, wali_kelas: e.target.value })} placeholder="Nama guru" style={inputStyle} />
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
                                    {['No', 'Nama Kelas', 'Tingkat', 'Jurusan', 'Tahun', 'Wali Kelas', 'Aksi'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat...</td></tr>
                                ) : kelasList.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data kelas</td></tr>
                                ) : kelasList.map((k, i) => (
                                    <tr key={k.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{i + 1}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{k.nama}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{k.tingkat}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{k.jurusan || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{k.tahun_pelajaran}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{k.wali_kelas || '-'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEdit(k)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                                <button onClick={() => handleDelete(k.id)} style={{ padding: '6px 14px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
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

export default DataKelasPage;

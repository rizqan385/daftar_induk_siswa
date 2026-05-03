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

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Data Kelas" />
                <main className="page-wrapper fade-in">
                    <div className="page-toolbar">
                        <h2 className="page-title">Data Kelas</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => { setShowForm(true); setEditItem(null); setForm({ nama: '', tingkat: 'X', jurusan: '', tahun_pelajaran: '2024/2025', wali_kelas: '' }); }}
                        >
                            + Tambah Kelas
                        </button>
                    </div>

                    {showForm && (
                        <div className="card" style={{ marginBottom: '18px' }}>
                            <div className="card-header">
                                <div className="card-title">{editItem ? 'Edit Kelas' : 'Tambah Kelas Baru'}</div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Nama Kelas</label>
                                        <input className="form-input" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="X TKJ" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tingkat</label>
                                        <select className="form-input" value={form.tingkat} onChange={e => setForm({ ...form, tingkat: e.target.value })}>
                                            <option value="X">X</option>
                                            <option value="XI">XI</option>
                                            <option value="XII">XII</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Jurusan</label>
                                        <input className="form-input" value={form.jurusan} onChange={e => setForm({ ...form, jurusan: e.target.value })} placeholder="TKJ" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tahun Pelajaran</label>
                                        <input className="form-input" value={form.tahun_pelajaran} onChange={e => setForm({ ...form, tahun_pelajaran: e.target.value })} placeholder="2024/2025" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Wali Kelas</label>
                                        <input className="form-input" value={form.wali_kelas} onChange={e => setForm({ ...form, wali_kelas: e.target.value })} placeholder="Nama guru" />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                                        <button type="submit" className="btn btn-green">{editItem ? 'Update' : 'Simpan'}</button>
                                        <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Batal</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        {['No', 'Nama Kelas', 'Tingkat', 'Jurusan', 'Tahun', 'Wali Kelas', 'Aksi'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-text">Memuat...</div></div></td></tr>
                                    ) : kelasList.length === 0 ? (
                                        <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-text">Belum ada data kelas</div></div></td></tr>
                                    ) : kelasList.map((k, i) => (
                                        <tr key={k.id}>
                                            <td style={{ color: 'var(--text-muted)', width: '50px' }}>{i + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{k.nama}</td>
                                            <td><span className="badge badge-info">{k.tingkat}</span></td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{k.jurusan || '-'}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{k.tahun_pelajaran}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{k.wali_kelas || '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button className="action-btn" onClick={() => handleEdit(k)} title="Edit">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    </button>
                                                    <button className="action-btn danger" onClick={() => handleDelete(k.id)} title="Hapus">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataKelasPage;

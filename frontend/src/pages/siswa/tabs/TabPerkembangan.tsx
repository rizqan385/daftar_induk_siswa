import { useState } from 'react';
import type { Siswa } from "../../../types/siswa.types";
import Button from "../../../components/ui/Button";

interface TabPerkembanganProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

interface PerkembanganRow {
    tahun_ajaran: string;
    semester: number;
    tinggi: number;
    berat: number;
    pendengaran: string;
    penglihatan: string;
    gigi: string;
}

const TabPerkembangan = ({ siswa, isNew: _isNew, onSave: _onSave }: TabPerkembanganProps) => {
    // Build perkembangan data from existing kesehatan + kehadiran data
    const [rows, setRows] = useState<PerkembanganRow[]>(() => {
        // Try to build from catatan_semester data
        const existing: PerkembanganRow[] = [];
        if (siswa?.catatan_semester) {
            for (const cs of siswa.catatan_semester) {
                existing.push({
                    tahun_ajaran: '2024/2025',
                    semester: cs.semester,
                    tinggi: 0,
                    berat: 0,
                    pendengaran: '',
                    penglihatan: '',
                    gigi: ''
                });
            }
        }
        return existing;
    });

    const [newRow, setNewRow] = useState<PerkembanganRow>({
        tahun_ajaran: '2024/2025',
        semester: 1,
        tinggi: 0,
        berat: 0,
        pendengaran: '',
        penglihatan: '',
        gigi: ''
    });

    const addRow = () => {
        setRows([...rows, { ...newRow }]);
        // Reset form for next entry
        setNewRow(prev => ({ ...prev, semester: prev.semester + 1, tinggi: 0, berat: 0, pendengaran: '', penglihatan: '', gigi: '' }));
    };

    const removeRow = (idx: number) => {
        setRows(rows.filter((_, i) => i !== idx));
    };

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)',
        background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '8px' }}>
                    📊 KETERANGAN PERKEMBANGAN SISWA
                </h3>
                <div style={{ 
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', 
                    borderRadius: '8px', padding: '16px', marginBottom: '20px'
                }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                        ℹ️ Data di bawah ini mencatat perkembangan fisik & kesehatan siswa setiap semester.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                        <strong>Tahun Ajaran Aktif:</strong> 2024/2025
                    </p>
                </div>
            </div>

            <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Riwayat Perkembangan</h4>
                <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                {['Tahun Ajaran', 'Semester', 'Tinggi', 'Berat', 'Pendengaran', 'Penglihatan', 'Gigi', ''].map(h => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Belum ada data riwayat.
                                    </td>
                                </tr>
                            ) : rows.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.tahun_ajaran}</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.semester}</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.tinggi} cm</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.berat} kg</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.pendengaran || '-'}</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.penglihatan || '-'}</td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{r.gigi || '-'}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <button onClick={() => removeRow(i)} style={{ padding: '4px 10px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add new row form */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>+ Update Data Semester Ini</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Tahun Ajaran</label>
                        <input value={newRow.tahun_ajaran} onChange={e => setNewRow({...newRow, tahun_ajaran: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Semester</label>
                        <select value={newRow.semester} onChange={e => setNewRow({...newRow, semester: Number(e.target.value)})} style={inputStyle}>
                            {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Tinggi (cm)</label>
                        <input type="number" value={newRow.tinggi || ''} onChange={e => setNewRow({...newRow, tinggi: Number(e.target.value)})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Berat (kg)</label>
                        <input type="number" value={newRow.berat || ''} onChange={e => setNewRow({...newRow, berat: Number(e.target.value)})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Pendengaran</label>
                        <input value={newRow.pendengaran} onChange={e => setNewRow({...newRow, pendengaran: e.target.value})} placeholder="Normal" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Penglihatan</label>
                        <input value={newRow.penglihatan} onChange={e => setNewRow({...newRow, penglihatan: e.target.value})} placeholder="Normal" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Gigi</label>
                        <input value={newRow.gigi} onChange={e => setNewRow({...newRow, gigi: e.target.value})} placeholder="Baik" style={inputStyle} />
                    </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <Button onClick={addRow} size="sm">+ Update Data Semester Ini</Button>
                </div>
            </div>
        </div>
    );
};

export default TabPerkembangan;

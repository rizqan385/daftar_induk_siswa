import { useState, useEffect } from 'react';
import type { Siswa, Kepribadian } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabKepribadianProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabKepribadian = ({ siswa, isNew, onSave }: TabKepribadianProps) => {
    const [list, setList] = useState<Kepribadian[]>(siswa?.kepribadian || []);

    // Re-sync state from prop when siswa API data is refreshed
    useEffect(() => {
        setList(siswa?.kepribadian || []);
    }, [siswa]);

    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ kepribadian: list });
    };

    const addItem = () => {
        setList([...list, { id: Date.now(), aspek: '', nilai: 'Baik', tahun_pelajaran: '' }]);
    };

    const updateItem = (id: number, field: keyof Kepribadian, value: string) => {
        setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: number) => {
        setList(list.filter(item => item.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Data Kepribadian Siswa</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addItem}>+ Tambah Kepribadian</Button>
                </div>

                {list.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data kepribadian.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {list.map((item) => (
                            <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600 }}>Catatan Kepribadian #{item.id}</span>
                                    <Button type="button" variant="danger" size="sm" onClick={() => removeItem(item.id)}>Hapus</Button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <Input
                                        label="Aspek Kepribadian"
                                        value={item.aspek}
                                        onChange={(e) => updateItem(item.id, 'aspek', e.target.value)}
                                        placeholder="Cth: Introvert / Kedisiplinan / Kreatif"
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Nilai</label>
                                        <select
                                            value={item.nilai}
                                            onChange={(e) => updateItem(item.id, 'nilai', e.target.value)}
                                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)', fontSize: '1rem' }}
                                        >
                                            <option value="">- Pilih Nilai -</option>
                                            <option value="Baik">Baik</option>
                                            <option value="Cukup">Cukup</option>
                                            <option value="Kurang">Kurang</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Tahun Pelajaran"
                                        value={item.tahun_pelajaran}
                                        onChange={(e) => updateItem(item.id, 'tahun_pelajaran', e.target.value)}
                                        placeholder="2024/2025"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">💾 Simpan Data Kepribadian</Button>
            </div>
        </form>
    );
};

export default TabKepribadian;

import { useState } from 'react';
import type { Siswa, PemeriksaanBuku } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabPemeriksaanBukuProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabPemeriksaanBuku = ({ siswa, isNew, onSave }: TabPemeriksaanBukuProps) => {
    const [list, setList] = useState<PemeriksaanBuku[]>(siswa?.pemeriksaan_buku || []);

    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ pemeriksaan_buku: list });
    };

    const addItem = () => {
        setList([...list, { id: Date.now(), no_urut: list.length + 1, tanggal_periksa: '', nama_pemeriksa: '', jabatan: '', catatan_petugas: '' }]);
    };

    const updateItem = (id: number, field: string, value: string) => {
        setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: number) => {
        setList(list.filter(item => item.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Riwayat Pemeriksaan Buku Induk</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addItem}>+ Tambah Catatan Pemeriksaan</Button>
                </div>

                {list.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada catatan pemeriksaan buku induk.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {list.map((item, index) => (
                            <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>Pemeriksaan #{index + 1}</span>
                                    <Button type="button" variant="danger" size="sm" onClick={() => removeItem(item.id)}>Hapus</Button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                    <Input label="Tanggal Periksa" type="date" value={item.tanggal_periksa} onChange={(e) => updateItem(item.id, 'tanggal_periksa', e.target.value)} />
                                    <Input label="Nama Pemeriksa" value={item.nama_pemeriksa || ''} onChange={(e) => updateItem(item.id, 'nama_pemeriksa', e.target.value)} placeholder="Nama petugas pemeriksa" />
                                    <Input label="Jabatan Pemeriksa" value={item.jabatan || ''} onChange={(e) => updateItem(item.id, 'jabatan', e.target.value)} placeholder="Contoh: Kepala Sekolah" />
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <Input label="Keterangan / Catatan Petugas" value={item.catatan_petugas} onChange={(e) => updateItem(item.id, 'catatan_petugas', e.target.value)} placeholder="Data lengkap dan akurat / terdapat kekurangan..." />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <Button type="submit" size="lg">💾 Simpan Catatan Pemeriksaan</Button>
            </div>
        </form>
    );
};

export default TabPemeriksaanBuku;

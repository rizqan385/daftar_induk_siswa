import { useState } from 'react';
import type { Siswa, MeninggalkanSekolah } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabMeninggalkanSekolahProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabMeninggalkanSekolah = ({ siswa, isNew, onSave }: TabMeninggalkanSekolahProps) => {
    const [data, setData] = useState<MeninggalkanSekolah | undefined>(siswa?.meninggalkan_sekolah);
    const [isEditing, setIsEditing] = useState(!!data);

    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ meninggalkan_sekolah: data });
    };

    const initData = () => {
        setData({
            id: Date.now(),
            tipe: 'tamat',
            tanggal_keluar: '',
            alasan: '',
            tujuan: '',
            sekolah_tujuan: '',
            alamat_sekolah_tujuan: '',
            no_ijazah: ''
        });
        setIsEditing(true);
    };

    const clearData = () => {
        if (window.confirm('Yakin ingin menghapus data kepindahan ini?')) {
            setData(undefined);
            setIsEditing(false);
            onSave({ meninggalkan_sekolah: undefined });
        }
    };

    const handleChange = (field: string, value: string) => {
        if (data) setData({ ...data, [field]: value });
    };

    if (!isEditing || !data) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '60px 24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🏫</div>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
                    Siswa ini belum memiliki catatan meninggalkan sekolah. Klik tombol di bawah untuk mengisi data jika siswa pindah, tamat, atau putus sekolah.
                </p>
                <Button variant="secondary" onClick={initData}>+ Isi Data Meninggalkan Sekolah</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Data Meninggalkan Sekolah</h3>
                    <Button type="button" variant="danger" size="sm" onClick={clearData}>Hapus Data Ini</Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tipe Keluar</label>
                        <select
                            value={data.tipe || ''}
                            onChange={(e) => handleChange('tipe', e.target.value)}
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)', fontSize: '1rem' }}
                        >
                            <option value="">- Pilih Tipe -</option>
                            <option value="tamat">Tamat / Lulus</option>
                            <option value="pindah">Pindah Sekolah</option>
                            <option value="putus">Putus Sekolah</option>
                        </select>
                    </div>
                    <Input label="Tanggal Keluar" type="date" value={data.tanggal_keluar} onChange={(e) => handleChange('tanggal_keluar', e.target.value)} />
                    <Input label="No. Ijazah (jika lulus)" value={data.no_ijazah || ''} onChange={(e) => handleChange('no_ijazah', e.target.value)} placeholder="DN-1234567" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <Input label="Alasan Meninggalkan Sekolah" value={data.alasan} onChange={(e) => handleChange('alasan', e.target.value)} placeholder="Contoh: Pindah domisili orang tua" />
                    <Input label="Tujuan (ke mana setelah keluar)" value={data.tujuan} onChange={(e) => handleChange('tujuan', e.target.value)} placeholder="Contoh: Melanjutkan kuliah / Bekerja" />
                </div>

                {data.tipe === 'pindah' && (
                    <div style={{ marginTop: '24px', background: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '12px', border: '1px dashed rgba(59, 130, 246, 0.3)' }}>
                        <h4 style={{ color: 'var(--accent-color)', marginBottom: '16px', fontSize: '0.95rem' }}>Detail Pindah Sekolah</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input label="Nama Sekolah Tujuan" value={data.sekolah_tujuan || ''} onChange={(e) => handleChange('sekolah_tujuan', e.target.value)} placeholder="SMAN 2 Surabaya" />
                            <Input label="Alamat Sekolah Tujuan" value={data.alamat_sekolah_tujuan || ''} onChange={(e) => handleChange('alamat_sekolah_tujuan', e.target.value)} placeholder="Jl. Raya No. 5, Surabaya" />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">💾 Simpan Data Keluar</Button>
            </div>
        </form>
    );
};

export default TabMeninggalkanSekolah;

import { useState } from 'react';
import type { Siswa, Prestasi, Beasiswa } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabLainnyaProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabLainnya = ({ siswa, isNew, onSave }: TabLainnyaProps) => {
    // 1-to-Many State
    const [prestasiList, setPrestasiList] = useState<Prestasi[]>(siswa?.prestasi || []);
    const [beasiswaList, setBeasiswaList] = useState<Beasiswa[]>(siswa?.beasiswa || []);

    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu sebelum mengisi fitur data Lainnya.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ prestasi: prestasiList, beasiswa: beasiswaList });
    };

    // Generic Array Handlers
    const addPrestasi = () => {
        setPrestasiList([...prestasiList, { id: Date.now(), nama_prestasi: '', tingkat: '', tahun: '' }]);
    };
    const updatePrestasi = (id: number, field: string, value: string) => {
        setPrestasiList(prestasiList.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    const removePrestasi = (id: number) => {
        setPrestasiList(prestasiList.filter(p => p.id !== id));
    };

    const addBeasiswa = () => {
        setBeasiswaList([...beasiswaList, { id: Date.now(), nama_beasiswa: '', sumber: '', tahun_mulai: '', tahun_selesai: '' }]);
    };
    const updateBeasiswa = (id: number, field: string, value: string) => {
        setBeasiswaList(beasiswaList.map(b => b.id === id ? { ...b, [field]: value } : b));
    };
    const removeBeasiswa = (id: number) => {
        setBeasiswaList(beasiswaList.filter(b => b.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Form Section: Prestasi */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Prestasi (Luar Akademik)</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addPrestasi}>+ Tambah Prestasi</Button>
                </div>
                
                {prestasiList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data prestasi.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {prestasiList.map((p) => (
                            <div key={p.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Nama Lomba / Prestasi" 
                                        value={p.nama_prestasi} 
                                        placeholder="Contoh: Juara 1 Coding Nasional" 
                                        onChange={(e) => updatePrestasi(p.id, 'nama_prestasi', e.target.value)} 
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tingkat</label>
                                    <select 
                                        value={p.tingkat}
                                        onChange={(e) => updatePrestasi(p.id, 'tingkat', e.target.value)}
                                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                                    >
                                        <option value="">- Pilih Tingkat -</option>
                                        <option value="Sekolah">Sekolah</option>
                                        <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                                        <option value="Provinsi">Provinsi</option>
                                        <option value="Nasional">Nasional</option>
                                        <option value="Internasional">Internasional</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input 
                                        label="Tahun" 
                                        value={p.tahun} 
                                        placeholder="2024" 
                                        onChange={(e) => updatePrestasi(p.id, 'tahun', e.target.value)} 
                                    />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removePrestasi(p.id)} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Section: Beasiswa */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Riwayat Beasiswa</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addBeasiswa}>+ Tambah Beasiswa</Button>
                </div>
                
                {beasiswaList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data beasiswa.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {beasiswaList.map((b) => (
                            <div key={b.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ flexBasis: '100%' }}>
                                    <Input 
                                        label="Nama Beasiswa" 
                                        value={b.nama_beasiswa} 
                                        placeholder="Contoh: Beasiswa Pintar" 
                                        onChange={(e) => updateBeasiswa(b.id, 'nama_beasiswa', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Instansi Sumber / Pemberi" 
                                        value={b.sumber} 
                                        placeholder="Contoh: Kemdikbud" 
                                        onChange={(e) => updateBeasiswa(b.id, 'sumber', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input 
                                        label="Tahun Mulai" 
                                        value={b.tahun_mulai} 
                                        placeholder="2023" 
                                        onChange={(e) => updateBeasiswa(b.id, 'tahun_mulai', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input 
                                        label="Tahun Selesai" 
                                        value={b.tahun_selesai} 
                                        placeholder="2024" 
                                        onChange={(e) => updateBeasiswa(b.id, 'tahun_selesai', e.target.value)} 
                                    />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removeBeasiswa(b.id)} style={{ marginTop: '24px', padding: '10px' }}>Hapus</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Note about other minor entities */}
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', padding: '16px', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Info Tambahan:</strong> Untuk fitur Kepribadian, Pemeriksaan Buku, dan Pindah Sekolah (Meninggalkan Sekolah) dapat mengikuti struktur UI/state yang sama seperti tab Identitas (1-to-1) dan Prestasi (1-to-Many). Tab ini difokuskan pada Prestasi dan Beasiswa sebagai referensi desain.
                </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">
                    💾 Simpan Data Lainnya
                </Button>
            </div>
            
        </form>
    );
};

export default TabLainnya;

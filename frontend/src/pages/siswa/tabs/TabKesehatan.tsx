import { useState, useEffect } from 'react';
import type { Siswa, KesehatanSiswa, RiwayatPenyakit } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabKesehatanProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
    section?: 'perkembangan';
}

const TabKesehatan = ({ siswa, isNew, onSave, section: _section }: TabKesehatanProps) => {
    // 1-to-1 State
    const [kesehatan, setKesehatan] = useState<KesehatanSiswa>({
        id: siswa?.kesehatan_siswa?.id || 0,
        tinggi_badan: siswa?.kesehatan_siswa?.tinggi_badan || 0,
        berat_badan: siswa?.kesehatan_siswa?.berat_badan || 0,
        golongan_darah: siswa?.kesehatan_siswa?.golongan_darah || '',
        kesanggupan_jasmani: siswa?.kesehatan_siswa?.kesanggupan_jasmani || ''
    });

    // 1-to-Many State
    const [riwayatPenyakit, setRiwayatPenyakit] = useState<RiwayatPenyakit[]>(siswa?.riwayat_penyakit || []);

    // Re-sync state from prop when siswa API data is refreshed
    useEffect(() => {
        setKesehatan({
            id: siswa?.kesehatan_siswa?.id || 0,
            tinggi_badan: siswa?.kesehatan_siswa?.tinggi_badan || 0,
            berat_badan: siswa?.kesehatan_siswa?.berat_badan || 0,
            golongan_darah: siswa?.kesehatan_siswa?.golongan_darah || '',
            kesanggupan_jasmani: siswa?.kesehatan_siswa?.kesanggupan_jasmani || ''
        });
        setRiwayatPenyakit(siswa?.riwayat_penyakit || []);
    }, [siswa]);


    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu sebelum mengisi data Kesehatan.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: Partial<Siswa> = {
            kesehatan_siswa: kesehatan,
            riwayat_penyakit: riwayatPenyakit
        };

        onSave(payload);
    };

    const addPenyakit = () => {
        setRiwayatPenyakit([...riwayatPenyakit, { id: Date.now(), nama_penyakit: '', tahun_sakit: '', keterangan: '' }]);
    };

    const updatePenyakit = (id: number, field: string, value: string) => {
        setRiwayatPenyakit(riwayatPenyakit.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const removePenyakit = (id: number) => {
        setRiwayatPenyakit(riwayatPenyakit.filter(p => p.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Form Section: Data Fisik */}
            <div>
                <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Data Fisik & Jasmani Siswa</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <Input 
                        label="Tinggi Badan (cm)" 
                        type="number" 
                        value={kesehatan.tinggi_badan || ''} 
                        onChange={(e) => setKesehatan({...kesehatan, tinggi_badan: parseInt(e.target.value) || 0})} 
                    />
                    <Input 
                        label="Berat Badan (kg)" 
                        type="number" 
                        value={kesehatan.berat_badan || ''} 
                        onChange={(e) => setKesehatan({...kesehatan, berat_badan: parseInt(e.target.value) || 0})} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Golongan Darah</label>
                        <select 
                            value={kesehatan.golongan_darah || ''}
                            onChange={(e) => setKesehatan({...kesehatan, golongan_darah: e.target.value})}
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: '#ffffff', color: 'var(--text-primary)' }}
                        >
                            <option value="">- Pilih Golongan Darah -</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Input 
                        label="Kesanggupan Jasmani (Olahraga dll)" 
                        value={kesehatan.kesanggupan_jasmani || ''} 
                        onChange={(e) => setKesehatan({...kesehatan, kesanggupan_jasmani: e.target.value})} 
                        placeholder="Contoh: Baik / Tidak Sanggup Lari Jauh" 
                    />
                </div>
            </div>

            {/* Form Section: Riwayat Penyakit Khusus */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Riwayat Penyakit Menahun / Serius</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addPenyakit}>+ Tambah Riwayat Penyakit</Button>
                </div>
                
                {riwayatPenyakit.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tidak ada riwayat penyakit serius yang dicatat khusus.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {riwayatPenyakit.map((p) => (
                            <div key={p.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Nama Penyakit" 
                                        value={p.nama_penyakit} 
                                        placeholder="Contoh: Tifus" 
                                        onChange={(e) => updatePenyakit(p.id, 'nama_penyakit', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input 
                                        label="Tahun Sakit" 
                                        value={p.tahun_sakit || ''} 
                                        placeholder="2021" 
                                        onChange={(e) => updatePenyakit(p.id, 'tahun_sakit', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 3 }}>
                                    <Input 
                                        label="Keterangan Sakit" 
                                        value={p.keterangan || ''} 
                                        placeholder="Dirawat 1 minggu" 
                                        onChange={(e) => updatePenyakit(p.id, 'keterangan', e.target.value)} 
                                    />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removePenyakit(p.id)} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <Button type="submit" size="lg">
                    💾 Simpan Data Kesehatan
                </Button>
            </div>
            
        </form>
    );
};

export default TabKesehatan;

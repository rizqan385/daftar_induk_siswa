import { useState, useEffect } from 'react';
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
    const [pklList, setPklList] = useState<any[]>([]);
    const [ekskulList, setEkskulList] = useState<any[]>([]);

    // Re-sync state from prop when siswa API data is refreshed
    useEffect(() => {
        setPrestasiList(siswa?.prestasi || []);
        setBeasiswaList(siswa?.beasiswa || []);
        
        const _pkl: any[] = [];
        const _ekskul: any[] = [];
        if (siswa?.catatan_semester) {
            siswa.catatan_semester.forEach(cas => {
                _pkl.push(...(cas.pkl || []).map(p => ({ ...p, kelas: cas.kelas, semester: cas.semester })));
                _ekskul.push(...(cas.ekstrakurikuler || []).map(e => ({ ...e, kelas: cas.kelas, semester: cas.semester })));
            });
        }
        setPklList(_pkl);
        setEkskulList(_ekskul);
    }, [siswa]);


    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu sebelum mengisi fitur data Lainnya.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ prestasi: prestasiList, beasiswa: beasiswaList, pkl: pklList, ekstrakurikuler: ekskulList } as any);
    };

    // Generic Array Handlers
    const addPrestasi = () => {
        setPrestasiList([...prestasiList, { id: Date.now(), bidang: undefined, nama_prestasi: '', tingkat: '', tahun: '', keterangan: '' } as any]);
    };
    const updatePrestasi = (id: number, field: string, value: string) => {
        setPrestasiList(prestasiList.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    const removePrestasi = (id: number) => {
        setPrestasiList(prestasiList.filter(p => p.id !== id));
    };

    const addBeasiswa = () => {
        setBeasiswaList([...beasiswaList, { id: Date.now(), tahun_pelajaran: '', pemberi: '', keterangan: '' }]);
    };
    const updateBeasiswa = (id: number, field: string, value: string) => {
        setBeasiswaList(beasiswaList.map(b => b.id === id ? { ...b, [field]: value } : b));
    };
    const removeBeasiswa = (id: number) => {
        setBeasiswaList(beasiswaList.filter(b => b.id !== id));
    };

    const addPkl = () => {
        setPklList([...pklList, { id: Date.now(), kelas: 'XI', semester: 3, nama_dudi: '', lokasi: '', lama_bulan: 3, keterangan: '' }]);
    };
    const updatePkl = (id: number, field: string, value: any) => {
        setPklList(pklList.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    const removePkl = (id: number) => {
        setPklList(pklList.filter(p => p.id !== id));
    };

    const addEkskul = () => {
        setEkskulList([...ekskulList, { id: Date.now(), kelas: 'X', semester: 1, nama_kegiatan: '', keterangan: '' }]);
    };
    const updateEkskul = (id: number, field: string, value: any) => {
        setEkskulList(ekskulList.map(e => e.id === id ? { ...e, [field]: value } : e));
    };
    const removeEkskul = (id: number) => {
        setEkskulList(ekskulList.filter(e => e.id !== id));
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
                            <div key={p.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Nama Lomba / Prestasi" 
                                        value={p.nama_prestasi} 
                                        placeholder="Contoh: Juara 1 Coding Nasional" 
                                        onChange={(e) => updatePrestasi(p.id, 'nama_prestasi', e.target.value)} 
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bidang</label>
                                    <select 
                                        value={p.bidang || ''}
                                        onChange={(e) => updatePrestasi(p.id, 'bidang', e.target.value)}
                                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}
                                    >
                                        <option value="">- Pilih Bidang -</option>
                                        <option value="Kesenian">Kesenian</option>
                                        <option value="Olahraga">Olahraga</option>
                                        <option value="Kemasyarakatan">Kemasyarakatan</option>
                                        <option value="Pramuka">Pramuka</option>
                                        <option value="Karya Tulis">Karya Tulis</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tingkat</label>
                                    <select 
                                        value={p.tingkat}
                                        onChange={(e) => updatePrestasi(p.id, 'tingkat', e.target.value)}
                                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}
                                    >
                                        <option value="">- Pilih Tingkat -</option>
                                        <option value="Sekolah">Sekolah</option>
                                        <option value="Kecamatan">Kecamatan</option>
                                        <option value="Kota">Kabupaten/Kota</option>
                                        <option value="Provinsi">Provinsi</option>
                                        <option value="Nasional">Nasional</option>
                                        <option value="Internasional">Internasional</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '80px' }}>
                                    <Input 
                                        label="Tahun" 
                                        value={p.tahun} 
                                        placeholder="2024" 
                                        onChange={(e) => updatePrestasi(p.id, 'tahun', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 2, minWidth: '150px' }}>
                                    <Input 
                                        label="Keterangan Tambahan" 
                                        value={p.keterangan || ''} 
                                        placeholder="Detail tambahan..." 
                                        onChange={(e) => updatePrestasi(p.id, 'keterangan', e.target.value)} 
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
                                <div style={{ flex: 1 }}>
                                    <Input 
                                        label="Tahun Pelajaran" 
                                        value={b.tahun_pelajaran} 
                                        placeholder="2024/2025" 
                                        onChange={(e) => updateBeasiswa(b.id, 'tahun_pelajaran', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Pemberi Beasiswa" 
                                        value={b.pemberi} 
                                        placeholder="Pemerintah / Swasta / Yayasan" 
                                        onChange={(e) => updateBeasiswa(b.id, 'pemberi', e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <Input 
                                        label="Keterangan" 
                                        value={b.keterangan || ''} 
                                        placeholder="Keterangan tambahan" 
                                        onChange={(e) => updateBeasiswa(b.id, 'keterangan', e.target.value)} 
                                    />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removeBeasiswa(b.id)} style={{ marginTop: '24px', padding: '10px' }}>Hapus</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Section: PKL */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Praktik Kerja Lapangan (PKL)</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addPkl}>+ Tambah PKL</Button>
                </div>
                
                {pklList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data PKL.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pklList.map((p) => (
                            <div key={p.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 100px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kelas</label>
                                    <select value={p.kelas} onChange={(e) => updatePkl(p.id, 'kelas', e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}>
                                        <option value="X">X</option>
                                        <option value="XI">XI</option>
                                        <option value="XII">XII</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 100px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Semester</label>
                                    <select value={p.semester} onChange={(e) => updatePkl(p.id, 'semester', Number(e.target.value))} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}>
                                        {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <Input label="Nama DUDI" value={p.nama_dudi} placeholder="PT Teknologi" onChange={(e) => updatePkl(p.id, 'nama_dudi', e.target.value)} />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <Input label="Lokasi" value={p.lokasi} placeholder="Kota" onChange={(e) => updatePkl(p.id, 'lokasi', e.target.value)} />
                                </div>
                                <div style={{ flex: '0 0 100px' }}>
                                    <Input label="Lama (Bln)" value={p.lama_bulan} onChange={(e) => updatePkl(p.id, 'lama_bulan', Number(e.target.value))} />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <Input label="Keterangan" value={p.keterangan || ''} onChange={(e) => updatePkl(p.id, 'keterangan', e.target.value)} />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removePkl(p.id)} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Section: Ekstrakurikuler */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Ekstrakurikuler</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addEkskul}>+ Tambah Ekskul</Button>
                </div>
                
                {ekskulList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data ekstrakurikuler.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {ekskulList.map((e) => (
                            <div key={e.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 100px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kelas</label>
                                    <select value={e.kelas} onChange={(ev) => updateEkskul(e.id, 'kelas', ev.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}>
                                        <option value="X">X</option>
                                        <option value="XI">XI</option>
                                        <option value="XII">XII</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 100px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Semester</label>
                                    <select value={e.semester} onChange={(ev) => updateEkskul(e.id, 'semester', Number(ev.target.value))} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)' }}>
                                        {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 2, minWidth: '200px' }}>
                                    <Input label="Jenis Kegiatan / Ekskul" value={e.nama_ekskul || e.nama_kegiatan} placeholder="Pramuka" onChange={(ev) => updateEkskul(e.id, 'nama_kegiatan', ev.target.value)} />
                                </div>
                                <div style={{ flex: 2, minWidth: '200px' }}>
                                    <Input label="Keterangan" value={e.deskripsi || e.keterangan || ''} placeholder="Aktif" onChange={(ev) => updateEkskul(e.id, 'keterangan', ev.target.value)} />
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => removeEkskul(e.id)} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Note about other minor entities */}
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', padding: '16px', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Info Tambahan:</strong> Untuk fitur Kepribadian, Pemeriksaan Buku, dan Pindah Sekolah (Meninggalkan Sekolah) dapat mengikuti struktur UI/state yang sama seperti tab Identitas (1-to-1) dan Prestasi (1-to-Many).
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

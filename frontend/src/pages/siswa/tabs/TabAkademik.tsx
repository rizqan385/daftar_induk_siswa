import { useState } from 'react';
import type { Siswa, PendidikanSebelumnya, NilaiSemester, NilaiSikap, NilaiIjazah, Kehadiran } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabAkademikProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabAkademik = ({ siswa, isNew, onSave }: TabAkademikProps) => {
    // Array states
    const [pendidikanList, setPendidikanList] = useState<PendidikanSebelumnya[]>(siswa?.pendidikan_sebelumnya || []);
    const [nilaiSemesterList, setNilaiSemesterList] = useState<NilaiSemester[]>(siswa?.nilai_semester || []);
    const [nilaiSikapList, setNilaiSikapList] = useState<NilaiSikap[]>(siswa?.nilai_sikap || []);
    const [kehadiranList, setKehadiranList] = useState<Kehadiran[]>(siswa?.kehadiran || []);
    
    // Object state
    const [ijazah, setIjazah] = useState<NilaiIjazah>({
        id: siswa?.nilai_ijazah?.id || 0,
        nomor_ijazah: siswa?.nilai_ijazah?.nomor_ijazah || '',
        nilai_rata_rata: siswa?.nilai_ijazah?.nilai_rata_rata || 0,
        tahun_lulus: siswa?.nilai_ijazah?.tahun_lulus || '',
        tanggal_lulus: siswa?.nilai_ijazah?.tanggal_lulus || ''
    });

    // Sub-tab Navigation
    const [activeSubTab, setActiveSubTab] = useState<string | number>('riwayat');

    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu sebelum mengisi data Akademik.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Partial<Siswa> = {
            pendidikan_sebelumnya: pendidikanList,
            nilai_semester: nilaiSemesterList,
            nilai_sikap: nilaiSikapList,
            kehadiran: kehadiranList,
            nilai_ijazah: ijazah
        };
        onSave(payload);
    };

    const subTabs = [
        { id: 'riwayat', label: 'Riwayat & Ijazah' },
        { id: 1, label: 'Smtr 1' },
        { id: 2, label: 'Smtr 2' },
        { id: 3, label: 'Smtr 3' },
        { id: 4, label: 'Smtr 4' },
        { id: 5, label: 'Smtr 5' },
        { id: 6, label: 'Smtr 6' },
    ];

    const filteredNilai = typeof activeSubTab === 'number' ? nilaiSemesterList.filter(n => n.semester === activeSubTab) : [];
    const filteredSikap = typeof activeSubTab === 'number' ? nilaiSikapList.filter(n => n.semester === activeSubTab) : [];
    const kehadiranSubTab = typeof activeSubTab === 'number' ? kehadiranList.find(k => k.semester === activeSubTab) : null;

    const handleKehadiranChange = (semester: number, field: keyof Kehadiran, value: number) => {
        const index = kehadiranList.findIndex(k => k.semester === semester);
        if (index >= 0) {
            const newList = [...kehadiranList];
            // @ts-ignore
            newList[index][field] = value;
            setKehadiranList(newList);
        } else {
            const newKehadiran: Kehadiran = { id: Date.now(), kelas: "X", semester, jumlah_hadir: 0, jumlah_sakit: 0, jumlah_izin: 0, jumlah_alpa: 0 };
            // @ts-ignore
            newKehadiran[field] = value;
            setKehadiranList([...kehadiranList, newKehadiran]);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sub-navigation */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                {subTabs.map(tab => (
                    <button 
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSubTab(tab.id)}
                        style={{
                            background: activeSubTab === tab.id ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                            color: activeSubTab === tab.id ? 'white' : 'var(--text-secondary)',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            boxShadow: 'none',
                            border: activeSubTab === tab.id ? 'none' : '1px solid var(--border-color)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="fade-in">
                {activeSubTab === 'riwayat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Pendidikan Sebelumnya</h3>
                                <Button type="button" size="sm" variant="secondary" onClick={() => setPendidikanList([...pendidikanList, { id: Date.now(), tipe: "siswa_baru", jenjang: 'SMP/MTs', nama_sekolah: '', tahun_lulus: '' }])}>+ Tambah Riwayat</Button>
                            </div>
                            
                            {pendidikanList.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data pendidikan.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {pendidikanList.map((p) => (
                                        <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                                            <Button type="button" variant="danger" size="sm" onClick={() => setPendidikanList(pendidikanList.filter(item => item.id !== p.id))} style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px 8px' }}>x</Button>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status Masuk</label>
                                                    <select 
                                                        value={p.tipe || "siswa_baru"}
                                                        onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tipe: e.target.value as "siswa_baru"|"pindahan" } : item))}
                                                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                                                    >
                                                        <option value="siswa_baru">Siswa Baru</option>
                                                        <option value="pindahan">Pindahan</option>
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Jenjang</label>
                                                    <select 
                                                        value={p.jenjang}
                                                        onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, jenjang: e.target.value } : item))}
                                                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                                                    >
                                                        <option value="TK/PAUD">TK/PAUD</option>
                                                        <option value="SD/MI">SD/MI</option>
                                                        <option value="SMP/MTs">SMP/MTs</option>
                                                        <option value="Lainnya">Lainnya</option>
                                                    </select>
                                                </div>
                                                <Input label="Nama Sekolah Asal" value={p.nama_sekolah} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, nama_sekolah: e.target.value } : item))} />
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                <Input label="Tanggal Diterima/Pindah" type="date" value={p.tanggal_diterima || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tanggal_diterima: e.target.value } : item))} />
                                                <Input label="Alasan Pindah (jika ada)" value={p.alasan_pindah || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, alasan_pindah: e.target.value } : item))} />
                                                <Input label="No. SKHUN" value={p.no_skhun || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, no_skhun: e.target.value } : item))} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Informasi Kelulusan / Ijazah SMP/MTs</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <Input label="Nomor Ijazah" value={ijazah.nomor_ijazah} onChange={(e) => setIjazah({...ijazah, nomor_ijazah: e.target.value})} />
                                <Input label="Nilai Rata-rata Ujian" type="number" step="0.01" value={ijazah.nilai_rata_rata?.toString() || ''} onChange={(e) => setIjazah({...ijazah, nilai_rata_rata: parseFloat(e.target.value) || 0})} />
                                <Input label="Tahun Lulus" value={ijazah.tahun_lulus || ''} onChange={(e) => setIjazah({...ijazah, tahun_lulus: e.target.value})} />
                                <Input label="Tanggal Ijazah" type="date" value={ijazah.tanggal_lulus || ''} onChange={(e) => setIjazah({...ijazah, tanggal_lulus: e.target.value})} />
                            </div>
                        </div>
                    </div>
                )}

                {typeof activeSubTab === 'number' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        {/* Kehadiran */}
                        <div>
                            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Kehadiran - Semester {activeSubTab}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <Input label="Hadir (hari)" type="number" value={kehadiranSubTab?.jumlah_hadir?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab, 'jumlah_hadir', parseInt(e.target.value) || 0)} />
                                <Input label="Sakit (hari)" type="number" value={kehadiranSubTab?.jumlah_sakit?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab, 'jumlah_sakit', parseInt(e.target.value) || 0)} />
                                <Input label="Izin (hari)" type="number" value={kehadiranSubTab?.jumlah_izin?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab, 'jumlah_izin', parseInt(e.target.value) || 0)} />
                                <Input label="Alpa (hari)" type="number" value={kehadiranSubTab?.jumlah_alpa?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab, 'jumlah_alpa', parseInt(e.target.value) || 0)} />
                            </div>
                        </div>

                        {/* Nilai Mata Pelajaran */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Nilai Mata Pelajaran - Semester {activeSubTab}</h3>
                                <Button type="button" variant="secondary" size="sm" onClick={() => setNilaiSemesterList([...nilaiSemesterList, { id: Date.now(), mata_pelajaran_id: 0, mata_pelajaran: { id: Date.now(), nama_mapel: '', kelompok_mapel: 'A', keterangan: '' }, semester: activeSubTab, nilai_pengetahuan: 0, nilai_keterampilan: 0 }])}>+ Tambah Mapel</Button>
                            </div>
                            
                            {filteredNilai.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data nilai untuk semester ini.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {filteredNilai.map((n) => (
                                        <div key={n.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ flex: 2 }}>
                                                <Input label="Mata Pelajaran" value={n.mata_pelajaran?.nama_mapel || ''} placeholder="Contoh: Matematika" onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, mata_pelajaran: { ...item.mata_pelajaran!, nama_mapel: e.target.value } } : item))} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Input label="Pengetahuan (Angka)" type="number" value={n.nilai_pengetahuan?.toString() || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, nilai_pengetahuan: parseInt(e.target.value) || 0 } : item))} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Input label="Keterampilan (Angka)" type="number" value={n.nilai_keterampilan?.toString() || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, nilai_keterampilan: parseInt(e.target.value) || 0 } : item))} />
                                            </div>
                                            <Button type="button" variant="danger" size="sm" onClick={() => setNilaiSemesterList(nilaiSemesterList.filter(item => item.id !== n.id))} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nilai Sikap */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Penilaian Sikap - Semester {activeSubTab}</h3>
                                <Button type="button" variant="secondary" size="sm" onClick={() => setNilaiSikapList([...nilaiSikapList, { id: Date.now(), semester: activeSubTab, aspek_sikap: 'Spiritual', nilai: 'Baik', deskripsi: '' }])}>+ Tambah Sikap</Button>
                            </div>
                            
                            {filteredSikap.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data nilai sikap untuk semester ini.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {filteredSikap.map((n) => (
                                        <div key={n.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(100px, 1fr) 2fr auto', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Aspek Sikap</label>
                                                <select 
                                                    value={n.aspek_sikap}
                                                    onChange={(e) => setNilaiSikapList(nilaiSikapList.map(item => item.id === n.id ? { ...item, aspek_sikap: e.target.value } : item))}
                                                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                                                >
                                                    <option value="Spiritual">Spiritual</option>
                                                    <option value="Sosial">Sosial</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Predikat</label>
                                                <select 
                                                    value={n.nilai}
                                                    onChange={(e) => setNilaiSikapList(nilaiSikapList.map(item => item.id === n.id ? { ...item, nilai: e.target.value } : item))}
                                                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                                                >
                                                    <option value="Sangat Baik">Sangat Baik</option>
                                                    <option value="Baik">Baik</option>
                                                    <option value="Cukup">Cukup</option>
                                                    <option value="Kurang">Kurang</option>
                                                </select>
                                            </div>
                                            <Input label="Deskripsi" value={n.deskripsi} onChange={(e) => setNilaiSikapList(nilaiSikapList.map(item => item.id === n.id ? { ...item, deskripsi: e.target.value } : item))} />
                                            <Button type="button" variant="danger" size="sm" onClick={() => setNilaiSikapList(nilaiSikapList.filter(item => item.id !== n.id))} style={{ marginTop: '24px', padding: '10px' }}>x</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">
                    💾 Simpan Seluruh Data Akademik
                </Button>
            </div>
            
        </form>
    );
};

export default TabAkademik;

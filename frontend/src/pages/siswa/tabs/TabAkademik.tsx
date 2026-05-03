import { useState, useEffect } from 'react';
import type { Siswa, PendidikanSebelumnya, NilaiSemester, NilaiSikap, NilaiIjazah, Kehadiran } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { getMataPelajaran } from "../../../services/siswa.service";

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
    const [mapelList, setMapelList] = useState<any[]>([]);
    
    // Object state
    const [ijazah, setIjazah] = useState<NilaiIjazah>({
        id: siswa?.nilai_ijazah?.id || 0,
        nomor_ijazah: siswa?.nilai_ijazah?.nomor_ijazah || '',
        nilai_rata_rata: siswa?.nilai_ijazah?.nilai_rata_rata || 0,
        tahun_lulus: siswa?.nilai_ijazah?.tahun_lulus || '',
        tanggal_lulus: siswa?.nilai_ijazah?.tanggal_lulus || ''
    });

    // Load mata pelajaran list from API
    useEffect(() => {
        getMataPelajaran().then(data => setMapelList(data || [])).catch(() => {});
    }, []);

    // Re-sync state from prop when siswa API data is refreshed
    useEffect(() => {
        setPendidikanList(siswa?.pendidikan_sebelumnya || []);
        setNilaiSemesterList(siswa?.nilai_semester || []);
        setNilaiSikapList(siswa?.nilai_sikap || []);
        setKehadiranList(siswa?.kehadiran || []);
        setIjazah({
            id: siswa?.nilai_ijazah?.id || 0,
            nomor_ijazah: siswa?.nilai_ijazah?.nomor_ijazah || '',
            nilai_rata_rata: siswa?.nilai_ijazah?.nilai_rata_rata || 0,
            tahun_lulus: siswa?.nilai_ijazah?.tahun_lulus || '',
            tanggal_lulus: siswa?.nilai_ijazah?.tanggal_lulus || ''
        });
    }, [siswa]);

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

    // Helper: semester 1-2=X, 3-4=XI, 5-6=XII
    const semesterToKelas = (sem: number): "X" | "XI" | "XII" => {
        if (sem <= 2) return 'X';
        if (sem <= 4) return 'XI';
        return 'XII';
    };

    const filteredNilai = typeof activeSubTab === 'number' ? nilaiSemesterList.filter((n: NilaiSemester) => n.semester === activeSubTab) : [];
    const kehadiranSubTab = typeof activeSubTab === 'number' ? kehadiranList.find(k => k.semester === activeSubTab) : null;

    const handleKehadiranChange = (semester: number, field: keyof Kehadiran, value: number) => {
        const index = kehadiranList.findIndex(k => k.semester === semester);
        if (index >= 0) {
            const newList = [...kehadiranList];
            // @ts-ignore
            newList[index][field] = value;
            setKehadiranList(newList);
        } else {
            const newKehadiran: Kehadiran = {
                id: Date.now(), kelas: semesterToKelas(semester), semester,
                jumlah_hadir: 0, jumlah_sakit: 0, jumlah_izin: 0, jumlah_alpa: 0
            };
            // @ts-ignore
            newKehadiran[field] = value;
            setKehadiranList([...kehadiranList, newKehadiran]);
        }
    };

    const selectStyle = { padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)', width: '100%' };

    console.log("TabAkademik Render - activeSubTab:", activeSubTab, "filteredNilai length:", filteredNilai.length);

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
                {/* ===== TAB: RIWAYAT & IJAZAH ===== */}
                {activeSubTab === 'riwayat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Pendidikan Sebelumnya */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Pendidikan Sebelumnya</h3>
                                <Button type="button" size="sm" variant="secondary" onClick={() => setPendidikanList([...pendidikanList, { id: Date.now(), tipe: 'siswa_baru', tanggal_diterima: '', nama_sekolah: '', kelas_diterima: 'X' }])}>+ Tambah Riwayat</Button>
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
                                                    <select value={p.tipe || 'siswa_baru'} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tipe: e.target.value as 'siswa_baru'|'pindahan' } : item))} style={selectStyle}>
                                                        <option value="siswa_baru">Siswa Baru</option>
                                                        <option value="pindahan">Pindahan</option>
                                                    </select>
                                                </div>
                                                <Input label="Nama Sekolah Asal" value={p.nama_sekolah} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, nama_sekolah: e.target.value } : item))} />
                                                <Input label="Alamat Sekolah" value={p.alamat_sekolah || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, alamat_sekolah: e.target.value } : item))} />
                                                <Input label="Tanggal Diterima" type="date" value={p.tanggal_diterima || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tanggal_diterima: e.target.value } : item))} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kelas Diterima</label>
                                                    <select value={p.kelas_diterima || 'X'} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, kelas_diterima: e.target.value as 'X'|'XI'|'XII' } : item))} style={selectStyle}>
                                                        <option value="X">Kelas X</option>
                                                        <option value="XI">Kelas XI</option>
                                                        <option value="XII">Kelas XII</option>
                                                    </select>
                                                </div>
                                                <Input label="No. Ijazah" value={p.no_ijazah || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, no_ijazah: e.target.value } : item))} />
                                                <Input label="Tanggal Ijazah" type="date" value={p.tanggal_ijazah || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tanggal_ijazah: e.target.value } : item))} />
                                                <Input label="No. SKHUN" value={p.no_skhun || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, no_skhun: e.target.value } : item))} />
                                                <Input label="Tanggal SKHUN" type="date" value={p.tanggal_skhun || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, tanggal_skhun: e.target.value } : item))} />
                                                <Input label="Alasan Pindah" value={p.alasan_pindah || ''} onChange={(e) => setPendidikanList(pendidikanList.map(item => item.id === p.id ? { ...item, alasan_pindah: e.target.value } : item))} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nilai Ijazah SMP */}
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

                {/* ===== TAB: SEMESTER (1-6) ===== */}
                {typeof activeSubTab === 'number' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        {/* Kehadiran */}
                        <div>
                            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                Kehadiran — Semester {activeSubTab} (Kelas {semesterToKelas(activeSubTab as number)})
                            </h3>
                            <div key={'kehadiran-' + activeSubTab} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <Input label="Hari Efektif" type="number" value={kehadiranSubTab?.jumlah_hari_efektif?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'jumlah_hari_efektif', parseInt(e.target.value) || 0)} />
                                <Input label="Hadir (hari)" type="number" value={kehadiranSubTab?.jumlah_hadir?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'jumlah_hadir', parseInt(e.target.value) || 0)} />
                                <Input label="Sakit (hari)" type="number" value={kehadiranSubTab?.jumlah_sakit?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'jumlah_sakit', parseInt(e.target.value) || 0)} />
                                <Input label="Izin (hari)" type="number" value={kehadiranSubTab?.jumlah_izin?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'jumlah_izin', parseInt(e.target.value) || 0)} />
                                <Input label="Alpa (hari)" type="number" value={kehadiranSubTab?.jumlah_alpa?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'jumlah_alpa', parseInt(e.target.value) || 0)} />
                                <Input label="% Kehadiran" type="number" step="0.01" value={kehadiranSubTab?.persentase_hadir?.toString() || '0'} onChange={(e) => handleKehadiranChange(activeSubTab as number, 'persentase_hadir', parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>

                        {/* Nilai Mata Pelajaran */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Nilai Mata Pelajaran — Semester {activeSubTab}</h3>
                                <Button type="button" variant="secondary" size="sm" onClick={() => setNilaiSemesterList([...nilaiSemesterList, {
                                    id: Date.now(),
                                    mata_pelajaran_id: 0,
                                    mata_pelajaran: undefined,
                                    kelas: semesterToKelas(activeSubTab as number),
                                    semester: activeSubTab as number,
                                    tahun_pelajaran: '',
                                    nilai_pengetahuan: 0,
                                    nilai_keterampilan: 0
                                }])}>+ Tambah Mapel</Button>
                            </div>
                            
                            {filteredNilai.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada data nilai untuk semester ini.</p>
                            ) : (
                                <div key={'mapel-container-' + activeSubTab} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {filteredNilai.map((n) => (
                                        <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                                            <Button type="button" variant="danger" size="sm" onClick={() => setNilaiSemesterList(nilaiSemesterList.filter(item => item.id !== n.id))} style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 8px' }}>x</Button>
                                            
                                            {/* Row 1: Mata Pelajaran + Tahun Pelajaran */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', paddingRight: '40px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mata Pelajaran</label>
                                                    {mapelList.length > 0 ? (
                                                        <select
                                                            value={n.mata_pelajaran_id || 0}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || 0;
                                                                const mapel = mapelList.find((m: any) => m.id === id);
                                                                setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? {
                                                                    ...item,
                                                                    mata_pelajaran_id: id,
                                                                    mata_pelajaran: mapel ? { id: mapel.id, nama_mapel: mapel.nama, kelompok_mapel: mapel.kelompok, keterangan: '' } : undefined
                                                                } : item));
                                                            }}
                                                            style={selectStyle}
                                                        >
                                                            <option value={0}>— Pilih Mata Pelajaran —</option>
                                                            {mapelList.filter((m: any) => {
                                                                const studentClassName = siswa?.kelas_ref?.nama || '';
                                                                return m.kelas_target_1 === 'Semua' || m.kelas_target_1 === studentClassName || m.kelas_target_2 === studentClassName;
                                                            }).map((m: any) => (
                                                                <option key={m.id} value={m.id}>{m.nama} ({m.kelompok})</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <Input value={n.mata_pelajaran?.nama_mapel || ''} placeholder="Nama mata pelajaran" onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, mata_pelajaran: { ...item.mata_pelajaran!, nama_mapel: e.target.value } } : item))} />
                                                    )}
                                                </div>
                                                <Input label="Tahun Pelajaran" value={n.tahun_pelajaran || ''} placeholder="2024/2025" onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, tahun_pelajaran: e.target.value } : item))} />
                                            </div>
                                            {/* Row 2: Nilai Pengetahuan */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) minmax(80px, 1fr) 2fr', gap: '12px' }}>
                                                <Input label="Angka (Pengetahuan)" type="number" value={n.nilai_pengetahuan?.toString() || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, nilai_pengetahuan: parseInt(e.target.value) || 0 } : item))} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Predikat (Peng.)</label>
                                                    <select value={n.predikat_pengetahuan || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, predikat_pengetahuan: e.target.value as any } : item))} style={selectStyle}>
                                                        <option value="">-</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="C">C</option>
                                                        <option value="D">D</option>
                                                    </select>
                                                </div>
                                                <Input label="Deskripsi Pengetahuan" value={n.deskripsi_pengetahuan || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, deskripsi_pengetahuan: e.target.value } : item))} />
                                            </div>
                                            
                                            {/* Row 3: Nilai Keterampilan */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) minmax(80px, 1fr) 2fr', gap: '12px' }}>
                                                <Input label="Angka (Keterampilan)" type="number" value={n.nilai_keterampilan?.toString() || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, nilai_keterampilan: parseInt(e.target.value) || 0 } : item))} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Predikat (Ket.)</label>
                                                    <select value={n.predikat_keterampilan || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, predikat_keterampilan: e.target.value as any } : item))} style={selectStyle}>
                                                        <option value="">-</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="C">C</option>
                                                        <option value="D">D</option>
                                                    </select>
                                                </div>
                                                <Input label="Deskripsi Keterampilan" value={n.deskripsi_keterampilan || ''} onChange={(e) => setNilaiSemesterList(nilaiSemesterList.map(item => item.id === n.id ? { ...item, deskripsi_keterampilan: e.target.value } : item))} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Penilaian Sikap */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Penilaian Sikap — Semester {activeSubTab} (Kelas {semesterToKelas(activeSubTab as number)})</h3>
                            </div>
                            
                            {/* Single card per semester - matches DB unique constraint (siswa_id, kelas, semester) */}
                            {(() => {
                                const existing = nilaiSikapList.find(n => n.semester === activeSubTab);
                                const kelas = semesterToKelas(activeSubTab as number);

                                const handleSikapChange = (field: 'deskripsi_spiritual' | 'deskripsi_sosial', value: string) => {
                                    if (existing) {
                                        setNilaiSikapList(nilaiSikapList.map(item =>
                                            item.semester === activeSubTab ? { ...item, [field]: value } : item
                                        ));
                                    } else {
                                        setNilaiSikapList([...nilaiSikapList, {
                                            id: Date.now(),
                                            kelas,
                                            semester: activeSubTab as number,
                                            deskripsi_spiritual: field === 'deskripsi_spiritual' ? value : '',
                                            deskripsi_sosial: field === 'deskripsi_sosial' ? value : ''
                                        }]);
                                    }
                                };

                                return (
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Kelas:</span>
                                            <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{kelas}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Deskripsi Sikap Spiritual</label>
                                            <textarea
                                                value={existing?.deskripsi_spiritual || ''}
                                                rows={3}
                                                onChange={e => handleSikapChange('deskripsi_spiritual', e.target.value)}
                                                placeholder="Contoh: Selalu taat beribadah, bersyukur, dan berdoa sebelum belajar."
                                                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Deskripsi Sikap Sosial</label>
                                            <textarea
                                                value={existing?.deskripsi_sosial || ''}
                                                rows={3}
                                                onChange={e => handleSikapChange('deskripsi_sosial', e.target.value)}
                                                placeholder="Contoh: Jujur, disiplin, dan bertanggung jawab dalam kegiatan sekolah."
                                                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-primary)', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        {!existing && (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
                                                Isi form di atas lalu klik "Simpan Data Akademik" untuk menyimpan.
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">💾 Simpan Data Akademik</Button>
            </div>
        </form>
    );
};

export default TabAkademik;

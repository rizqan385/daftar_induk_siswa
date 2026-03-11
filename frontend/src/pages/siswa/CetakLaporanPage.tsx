import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CetakLaporan.css'; // We will create this dedicated print CSS

export const CetakLaporanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Settings State
    const [jenisLaporan, setJenisLaporan] = useState<'pribadi' | 'nilai'>('pribadi');
    const [semester, setSemester] = useState<number>(1);
    const [tempatCetak, setTempatCetak] = useState('Jakarta');
    const [tanggalCetak, setTanggalCetak] = useState(new Date().toISOString().split('T')[0]);
    
    // TTD State
    const [namaKepsek, setNamaKepsek] = useState('Dr. H. Contoh Kepsek, M.Pd.');
    const [nipKepsek, setNipKepsek] = useState('19700101 199512 1 001');
    const [namaWalikelas, setNamaWalikelas] = useState('Budi Guru, S.Pd.');
    const [nipWalikelas, setNipWalikelas] = useState('19850202 201001 1 002');

    // Data State
    const [siswa, setSiswa] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/siswa/${id}`);
                setSiswa(res.data.data);
            } catch (err) {
                console.error("Gagal memuat data siswa", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const getKelasForSemester = (sem: number): string => {
        if (sem === 1 || sem === 2) return 'X (Sepuluh)';
        if (sem === 3 || sem === 4) return 'XI (Sebelas)';
        if (sem === 5 || sem === 6) return 'XII (Dua Belas)';
        return '-';
    };

    if (loading) return <div>Memuat data laporan...</div>;
    if (!siswa) return <div>Siswa tidak ditemukan</div>;

    return (
        <div className="cetak-container">
            {/* INI BAGIAN PENGATURAN - Hanya muncul di layar, disembunyikan saat print */}
            <div className="cetak-settings no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>PENGATURAN CETAK LAPORAN</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate(`/siswa/${id}`)} style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            ← Kembali
                        </button>
                        <button onClick={handlePrint} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            🖨️ Cetak Sekarang
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    <div className="form-group">
                        <label>Jenis Laporan</label>
                        <select value={jenisLaporan} onChange={(e) => setJenisLaporan(e.target.value as any)} style={{ width: '100%', padding: '8px' }}>
                            <option value="pribadi">1. Data Pribadi Siswa</option>
                            <option value="nilai">2. Laporan Nilai per Semester</option>
                        </select>
                    </div>

                    {jenisLaporan === 'nilai' && (
                        <div className="form-group">
                            <label>Pilih Semester</label>
                            <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} style={{ width: '100%', padding: '8px' }}>
                                {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tempat Cetak</label>
                        <input type="text" value={tempatCetak} onChange={(e) => setTempatCetak(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div className="form-group">
                        <label>Tanggal Cetak</label>
                        <input type="date" value={tanggalCetak} onChange={(e) => setTanggalCetak(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div className="form-group">
                        <label>Nama Kepala Sekolah</label>
                        <input type="text" value={namaKepsek} onChange={(e) => setNamaKepsek(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    
                    <div className="form-group">
                        <label>NIP Kepala Sekolah</label>
                        <input type="text" value={nipKepsek} onChange={(e) => setNipKepsek(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    {jenisLaporan === 'nilai' && (
                        <>
                            <div className="form-group">
                                <label>Nama Wali Kelas</label>
                                <input type="text" value={namaWalikelas} onChange={(e) => setNamaWalikelas(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group">
                                <label>NIP Wali Kelas</label>
                                <input type="text" value={nipWalikelas} onChange={(e) => setNipWalikelas(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* INI KERTAS A4 YANG AKAN DICETAK */}
            <div className="kertas-a4 print-area">
                {jenisLaporan === 'pribadi' && (
                    <div className="laporan-pribadi">
                        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid black', paddingBottom: '15px' }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', textTransform: 'uppercase' }}>Keterangan Tentang Diri Peserta Didik</h2>
                        </div>

                        <table className="biodata-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', lineHeight: '1.8' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '3%' }}>1.</td>
                                    <td style={{ width: '40%' }}>Nama Peserta Didik (Lengkap)</td>
                                    <td style={{ width: '2%' }}>:</td>
                                    <td style={{ fontWeight: 'bold' }}>{siswa.nama_lengkap || siswa.nama}</td>
                                </tr>
                                <tr>
                                    <td>2.</td>
                                    <td>Nomor Induk / NISN</td>
                                    <td>:</td>
                                    <td>{siswa.no_induk} / {siswa.nisn}</td>
                                </tr>
                                <tr>
                                    <td>3.</td>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{siswa.tempat_lahir}, {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                </tr>
                                <tr>
                                    <td>4.</td>
                                    <td>Jenis Kelamin</td>
                                    <td>:</td>
                                    <td>{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                </tr>
                                <tr>
                                    <td>5.</td>
                                    <td>Agama</td>
                                    <td>:</td>
                                    <td>{siswa.agama}</td>
                                </tr>
                                <tr>
                                    <td>6.</td>
                                    <td>Anak ke</td>
                                    <td>:</td>
                                    <td>{siswa.anak_ke} dari {siswa.jumlah_saudara} bersaudara</td>
                                </tr>
                                <tr>
                                    <td>7.</td>
                                    <td>Alamat Peserta Didik</td>
                                    <td>:</td>
                                    <td>{siswa.alamat?.alamat_lengkap || '-'}</td>
                                </tr>
                                <tr>
                                    <td>8.</td>
                                    <td>Diterima di sekolah ini</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Di Kelas</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.kelas_diterima || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Pada Tanggal</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.tanggal_diterima ? new Date(siswa.pendidikan_sebelumnya[0].tanggal_diterima).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                                </tr>
                                <tr>
                                    <td>9.</td>
                                    <td>Sekolah Asal</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Nama Sekolah</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.asal_sekolah || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Alamat</td>
                                    <td>:</td>
                                    <td>{siswa.pendidikan_sebelumnya?.[0]?.alamat_sekolah || '-'}</td>
                                </tr>
                                <tr>
                                    <td>10.</td>
                                    <td>Nama Orang Tua</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Ayah</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Ibu</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td>11.</td>
                                    <td>Pekerjaan Orang Tua</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>a. Ayah</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ayah')?.pekerjaan || '-'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>b. Ibu</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.find((o: any) => o.tipe === 'ibu')?.pekerjaan || '-'}</td>
                                </tr>
                                <tr>
                                    <td>12.</td>
                                    <td>Alamat Orang Tua</td>
                                    <td>:</td>
                                    <td>{siswa.orang_tua?.[0]?.alamat || '-'}</td>
                                </tr>
                                <tr>
                                    <td>13.</td>
                                    <td>Nama Wali Peserta Didik</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td>14.</td>
                                    <td>Pekerjaan Wali</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.pekerjaan || '-'}</td>
                                </tr>
                                <tr>
                                    <td>15.</td>
                                    <td>Alamat Wali</td>
                                    <td>:</td>
                                    <td>{siswa.wali?.alamat || '-'}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
                            <div style={{ width: '150px', height: '200px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {siswa.foto_path ? (
                                    <img src={`${API_BASE}/uploads/${siswa.foto_path}`} alt="Pas Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>Pas Foto 3x4</span>
                                )}
                            </div>
                            <div style={{ width: '300px', textAlign: 'left' }}>
                                <p style={{ margin: '0 0 5px 0' }}>{tempatCetak}, {new Date(tanggalCetak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p style={{ margin: '0 0 80px 0' }}>Kepala Sekolah,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaKepsek}</p>
                                <p style={{ margin: '0' }}>NIP. {nipKepsek}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {jenisLaporan === 'nilai' && (
                    <div className="laporan-nilai">
                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid black', paddingBottom: '10px' }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', textTransform: 'uppercase' }}>LAPORAN HASIL BELAJAR PESERTA DIDIK</h2>
                        </div>

                        {/* Rapor Header */}
                        <table style={{ width: '100%', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '20%' }}>Nama Peserta Didik</td>
                                    <td style={{ width: '3%' }}>:</td>
                                    <td style={{ width: '47%', fontWeight: 'bold' }}>{siswa.nama_lengkap || siswa.nama}</td>
                                    <td style={{ width: '15%' }}>Kelas</td>
                                    <td style={{ width: '3%' }}>:</td>
                                    <td style={{ width: '12%' }}>{getKelasForSemester(semester)}</td>
                                </tr>
                                <tr>
                                    <td>Nomor Induk / NISN</td>
                                    <td>:</td>
                                    <td>{siswa.no_induk} / {siswa.nisn}</td>
                                    <td>Semester</td>
                                    <td>:</td>
                                    <td>{semester} {semester % 2 === 1 ? '(Ganjil)' : '(Genap)'}</td>
                                </tr>
                                <tr>
                                    <td>Nama Sekolah</td>
                                    <td>:</td>
                                    <td>SMK YAJ</td>
                                    <td>Tahun Pelajaran</td>
                                    <td>:</td>
                                    <td>{siswa.nilai_semester?.find((n: any) => n.semester === semester)?.tahun_pelajaran || '-'}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* A. Pengetahuan & Keterampilan */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '14px', margin: '0 0 5px 0' }}>A. Pengetahuan dan Keterampilan</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }} border={1}>
                                <thead>
                                    <tr>
                                        <th rowSpan={2} style={{ padding: '5px', width: '3%' }}>No</th>
                                        <th rowSpan={2} style={{ padding: '5px', width: '25%' }}>Mata Pelajaran</th>
                                        <th rowSpan={2} style={{ padding: '5px', width: '5%' }}>KB</th>
                                        <th colSpan={3} style={{ padding: '5px' }}>Pengetahuan</th>
                                        <th colSpan={3} style={{ padding: '5px' }}>Keterampilan</th>
                                    </tr>
                                    <tr>
                                        <th style={{ padding: '5px', width: '5%' }}>Angka</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Pred</th>
                                        <th style={{ padding: '5px' }}>Deskripsi</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Angka</th>
                                        <th style={{ padding: '5px', width: '5%' }}>Pred</th>
                                        <th style={{ padding: '5px' }}>Deskripsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siswa.nilai_semester?.filter((n: any) => n.semester === semester).map((nilai: any, idx: number) => (
                                        <tr key={nilai.id}>
                                            <td style={{ padding: '5px' }}>{idx + 1}</td>
                                            <td style={{ padding: '5px', textAlign: 'left' }}>{nilai.mata_pelajaran?.nama || '-'}</td>
                                            <td style={{ padding: '5px' }}>75</td>
                                            <td style={{ padding: '5px' }}>{nilai.nilai_pengetahuan}</td>
                                            <td style={{ padding: '5px' }}>{nilai.predikat_pengetahuan}</td>
                                            <td style={{ padding: '5px', textAlign: 'left', fontSize: '10px' }}>{nilai.deskripsi_pengetahuan}</td>
                                            <td style={{ padding: '5px' }}>{nilai.nilai_keterampilan}</td>
                                            <td style={{ padding: '5px' }}>{nilai.predikat_keterampilan}</td>
                                            <td style={{ padding: '5px', textAlign: 'left', fontSize: '10px' }}>{nilai.deskripsi_keterampilan}</td>
                                        </tr>
                                    ))}
                                    {(!siswa.nilai_semester || siswa.nilai_semester.filter((n: any) => n.semester === semester).length === 0) && (
                                        <tr>
                                            <td colSpan={9} style={{ padding: '15px' }}>Belum ada data nilai akademik untuk semester ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* B. Ekstrakurikuler & C. Ketidakhadiran Layout */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '14px', margin: '0 0 5px 0' }}>B. Ekstrakurikuler</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }} border={1}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '5px', width: '5%' }}>No</th>
                                            <th style={{ padding: '5px', width: '45%' }}>Kegiatan Ekstrakurikuler</th>
                                            <th style={{ padding: '5px' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswa.catatan_semester?.find((c: any) => c.semester === semester)?.ekstrakurikuler?.map((eks: any, idx: number) => (
                                            <tr key={eks.id || idx}>
                                                <td style={{ padding: '5px' }}>{idx + 1}</td>
                                                <td style={{ padding: '5px', textAlign: 'left' }}>{eks.nama_ekskul}</td>
                                                <td style={{ padding: '5px', textAlign: 'left' }}>{eks.deskripsi}</td>
                                            </tr>
                                        )) || (
                                            <tr>
                                                <td colSpan={3} style={{ padding: '10px' }}>-</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div style={{ width: '35%' }}>
                                <h3 style={{ fontSize: '14px', margin: '0 0 5px 0' }}>C. Ketidakhadiran</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }} border={1}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '5px', width: '60%' }}>Sakit</td>
                                            <td style={{ padding: '5px', textAlign: 'center' }}>
                                                {siswa.kehadiran?.find((k: any) => k.semester === semester)?.jumlah_sakit || 0} hari
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '5px' }}>Izin</td>
                                            <td style={{ padding: '5px', textAlign: 'center' }}>
                                                {siswa.kehadiran?.find((k: any) => k.semester === semester)?.jumlah_izin || 0} hari
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '5px' }}>Tanpa Keterangan</td>
                                            <td style={{ padding: '5px', textAlign: 'center' }}>
                                                {siswa.kehadiran?.find((k: any) => k.semester === semester)?.jumlah_alpa || 0} hari
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', fontSize: '14px' }}>
                            <div style={{ width: '30%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 80px 0' }}>Mengetahui:<br/>Orang Tua/Wali,</p>
                                <p style={{ margin: '0', fontWeight: 'bold' }}>.....................................</p>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 5px 0' }}><br/></p>
                                <p style={{ margin: '0 0 80px 0' }}>Wali Kelas,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaWalikelas}</p>
                                <p style={{ margin: '0' }}>NIP. {nipWalikelas}</p>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 5px 0' }}>{tempatCetak}, {new Date(tanggalCetak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p style={{ margin: '0 0 80px 0' }}>Kepala Sekolah,</p>
                                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{namaKepsek}</p>
                                <p style={{ margin: '0' }}>NIP. {nipKepsek}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

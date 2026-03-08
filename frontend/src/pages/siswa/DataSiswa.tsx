import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSiswa, useDeleteSiswa, useAddSiswa } from "../../hooks/useSiswa";
import * as XLSX from 'xlsx';
import type { Siswa } from '../../types/siswa.types';

const DataSiswa = () => {
    const { data: siswaList, isLoading } = useSiswa();
    const deleteSiswa = useDeleteSiswa();
    const addSiswa = useAddSiswa();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCreatePage = () => {
        navigate('/siswa/new');
    };

    const openEditPage = (id: number) => {
        navigate(`/siswa/${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Yakin ingin menghapus siswa ini?")) {
            deleteSiswa.mutate(id);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                let importCount = 0;
                // Parse rows. Assuming basic columns like "No Induk", "NISN", "Nama", "L/P" exist
                data.forEach((row: any) => {
                    if (row['Nama']) {
                        const newPayload: Partial<Siswa> = {
                            no_induk: String(row['No Induk'] || Math.floor(Math.random() * 10000)),
                            nisn: String(row['NISN'] || Math.floor(Math.random() * 1000000000)),
                            nama: row['Nama'],
                            jenis_kelamin: row['L/P'] === 'P' ? 'P' : 'L',
                            tanggal_lahir: '',
                            alamat_siswa: { id: 0, jalan: '', kelurahan: '', kecamatan: '', kota: '', provinsi: '', kode_pos: '' },
                            orang_tua: { id: 0, nama: '', pekerjaan: '', jalan: '', kelurahan: '', kecamatan: '', kota: '', provinsi: '', kode_pos: '' },
                            wali: { id: 0, nama_wali: row['Wali'] || 'Data Kosong', hubungan: '', pekerjaan_wali: '', no_telp_wali: '' },
                            kesehatan_siswa: { id: 0, tinggi_badan: 0, berat_badan: 0, golongan_darah: '' },
                            pendidikan_sebelumnya: [],
                            nilai_semester: [],
                            nilai_sikap: [],
                            riwayat_penyakit: [],
                            catatan_akhir_semester: [],
                            prestasi: [],
                            beasiswa: [],
                            kepribadian: [],
                            pemeriksaan_buku: []
                        };
                        addSiswa.mutate(newPayload as Siswa);
                        importCount++;
                    }
                });
                alert(`Berhasil mengimpor ${importCount} data siswa dari Excel!`);
            } catch (error) {
                console.error("Error importing Excel:", error);
                alert("Gagal membaca file Excel. Pastikan formatnya benar.");
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar title="Data Siswa" />
                
                <div className="fade-in" style={{ padding: '32px', maxWidth: '1200px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: "1.8rem", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Daftar Siswa
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Kelola data induk siswa</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls" 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="secondary" 
                                style={{ padding: '12px 24px', fontSize: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                            >
                                📄 Import Excel
                            </button>
                            <button onClick={openCreatePage} style={{ padding: '12px 24px', fontSize: '1rem' }}>
                                + Tambah Siswa
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        {isLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading data...</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>No Induk</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Nama</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>L/P</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Wali</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Prestasi</th>
                                        <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siswaList?.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                Tidak ada data siswa ditemukan.
                                            </td>
                                        </tr>
                                    ) : siswaList?.map((siswa) => (
                                        <tr key={siswa.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} 
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{siswa.no_induk}</td>
                                            <td style={{ padding: '16px 24px', fontWeight: 500 }}>{siswa.nama}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.8rem',
                                                    background: siswa.jenis_kelamin === 'L' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                                    color: siswa.jenis_kelamin === 'L' ? '#34d399' : '#fb7185'
                                                }}>
                                                    {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: 500 }}>{siswa.wali.nama_wali}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{siswa.wali.hubungan}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {siswa.prestasi?.slice(0, 2).map(p => (
                                                        <span key={p.id} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                            {p.nama_prestasi}
                                                        </span>
                                                    ))}
                                                    {siswa.prestasi?.length > 2 && (
                                                        <span style={{ background: 'var(--bg-color)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                            +{siswa.prestasi.length - 2}
                                                        </span>
                                                    )}
                                                    {(!siswa.prestasi || siswa.prestasi.length === 0) && <span style={{ color: 'var(--text-secondary)' }}>-</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button className="secondary" onClick={() => openEditPage(siswa.id)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Detail / Edit</button>
                                                    <button className="danger" onClick={() => handleDelete(siswa.id)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSiswa;

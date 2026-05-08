import { useState, useEffect } from 'react';
import type { Siswa } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabPendidikanProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabPendidikan = ({ siswa, isNew: _isNew, onSave }: TabPendidikanProps) => {

    const [formData, setFormData] = useState({
        tipe: 'siswa_baru' as 'siswa_baru' | 'pindahan',
        tanggal_diterima: siswa?.pendidikan_sebelumnya?.[0]?.tanggal_diterima || '',
        nama_sekolah: siswa?.pendidikan_sebelumnya?.[0]?.nama_sekolah || '',
        alamat_sekolah: siswa?.pendidikan_sebelumnya?.[0]?.alamat_sekolah || '',
        no_ijazah: siswa?.pendidikan_sebelumnya?.[0]?.no_ijazah || '',
        tanggal_ijazah: siswa?.pendidikan_sebelumnya?.[0]?.tanggal_ijazah || '',
        no_skhun: siswa?.pendidikan_sebelumnya?.[0]?.no_skhun || '',
        tanggal_skhun: siswa?.pendidikan_sebelumnya?.[0]?.tanggal_skhun || '',
        kelas_diterima: siswa?.pendidikan_sebelumnya?.[0]?.kelas_diterima || '', // string representation
        kelas_id: (siswa as any)?.kelas_id || '', // id representation for assigning main Siswa class
        alasan_pindah: siswa?.pendidikan_sebelumnya?.[0]?.alasan_pindah || '',
    });

    const [kelasList, setKelasList] = useState<any[]>([]);
    useEffect(() => {
        import('../../../services/api').then(({ default: api }) => {
            api.get('/kelas').then(r => setKelasList(r.data.data || [])).catch(() => {});
        });
    }, []);

    // Re-sync form when siswa data arrives from API
    useEffect(() => {
        if (!siswa) return;
        setFormData(prev => ({
            ...prev,
            tipe: (siswa.pendidikan_sebelumnya?.[0]?.tipe as 'siswa_baru' | 'pindahan') || 'siswa_baru',
            tanggal_diterima: siswa.pendidikan_sebelumnya?.[0]?.tanggal_diterima || '',
            nama_sekolah: siswa.pendidikan_sebelumnya?.[0]?.nama_sekolah || '',
            alamat_sekolah: siswa.pendidikan_sebelumnya?.[0]?.alamat_sekolah || '',
            no_ijazah: siswa.pendidikan_sebelumnya?.[0]?.no_ijazah || '',
            tanggal_ijazah: siswa.pendidikan_sebelumnya?.[0]?.tanggal_ijazah || '',
            no_skhun: siswa.pendidikan_sebelumnya?.[0]?.no_skhun || '',
            tanggal_skhun: siswa.pendidikan_sebelumnya?.[0]?.tanggal_skhun || '',
            kelas_diterima: siswa.pendidikan_sebelumnya?.[0]?.kelas_diterima || '',
            kelas_id: (siswa as any).kelas_id || '',
            alasan_pindah: siswa.pendidikan_sebelumnya?.[0]?.alasan_pindah || '',
        }));
    }, [siswa]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === 'kelas_id') {
            const selectedKelas = kelasList.find(k => k.id === Number(e.target.value));
            setFormData({ 
                ...formData, 
                kelas_id: e.target.value,
                kelas_diterima: selectedKelas ? selectedKelas.nama : ''
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            pendidikan_sebelumnya: [{
                id: siswa?.pendidikan_sebelumnya?.[0]?.id || 0,
                ...formData,
                kelas_diterima: formData.kelas_diterima,
            }],
            ...(formData.kelas_id ? { kelas_id: Number(formData.kelas_id) } : {})
        });
    };

    // Nilai Ijazah table
    const nilaiIjazah = siswa?.nilai_ijazah;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '16px' }}>📜 PENDIDIKAN SEBELUMNYA</h3>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="tipe" value="siswa_baru" checked={formData.tipe === 'siswa_baru'} onChange={handleChange} />
                        <span style={{ color: 'var(--text-primary)' }}>Siswa Baru</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="tipe" value="pindahan" checked={formData.tipe === 'pindahan'} onChange={handleChange} />
                        <span style={{ color: 'var(--text-primary)' }}>Pindahan</span>
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Tanggal Diterima" name="tanggal_diterima" type="date" value={formData.tanggal_diterima} onChange={handleChange} />
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kelas Diterima / Kelas Saat Ini</label>
                        <select name="kelas_id" value={formData.kelas_id} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            <option value="">-- Pilih Kelas --</option>
                            {kelasList.map(k => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <h4 style={{ marginTop: '24px', marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    Asal Sekolah / Ijazah
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Nama Sekolah Asal" name="nama_sekolah" value={formData.nama_sekolah} onChange={handleChange} />
                    <Input label="Alamat Sekolah Asal" name="alamat_sekolah" value={formData.alamat_sekolah} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="No. Ijazah" name="no_ijazah" value={formData.no_ijazah} onChange={handleChange} />
                    <Input label="Tanggal Ijazah" name="tanggal_ijazah" type="date" value={formData.tanggal_ijazah} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="No. SKHUN" name="no_skhun" value={formData.no_skhun} onChange={handleChange} />
                    <Input label="Tanggal SKHUN" name="tanggal_skhun" type="date" value={formData.tanggal_skhun} onChange={handleChange} />
                </div>

                {formData.tipe === 'pindahan' && (
                    <div style={{ marginTop: '20px' }}>
                        <Input label="Alasan Pindah" name="alasan_pindah" value={formData.alasan_pindah} onChange={handleChange} />
                    </div>
                )}
            </div>

            {/* Nilai Ijazah Section */}
            {nilaiIjazah && (
                <div>
                    <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                        📊 Nilai Ijazah
                    </h4>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    {['No. Ijazah', 'Nilai Rata-rata', 'Tahun Lulus'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{nilaiIjazah.nomor_ijazah || nilaiIjazah.no_ijazah || '-'}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{nilaiIjazah.nilai_rata_rata || '-'}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{nilaiIjazah.tahun_lulus || nilaiIjazah.tanggal_lulus || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Button type="submit" size="lg">💾 Simpan Pendidikan</Button>
            </div>
        </form>
    );
};

export default TabPendidikan;

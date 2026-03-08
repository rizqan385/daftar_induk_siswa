import { useState } from 'react';
import type { Siswa, OrangTua, AlamatSiswa, Wali } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TabIdentitasProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabIdentitas = ({ siswa, onSave }: TabIdentitasProps) => {
    // Local state for all fields in this tab
    const [formData, setFormData] = useState({
        // Base Siswa
        no_induk: siswa?.no_induk || '',
        nisn: siswa?.nisn || '',
        nama: siswa?.nama || '',
        nama_panggilan: siswa?.nama_panggilan || '',
        jenis_kelamin: siswa?.jenis_kelamin || 'L',
        tanggal_lahir: siswa?.tanggal_lahir || '',
        tempat_lahir: siswa?.tempat_lahir || '',
        agama: siswa?.agama || '',
        anak_ke: siswa?.anak_ke || 1,
        jumlah_saudara: siswa?.jumlah_saudara || 0,
        kewarganegaraan: siswa?.kewarganegaraan || 'WNI',
        bahasa_rumah: siswa?.bahasa_rumah || 'Indonesia',

        // Alamat
        alamat_jalan: siswa?.alamat_siswa?.jalan || '',
        alamat_kelurahan: siswa?.alamat_siswa?.kelurahan || '',
        alamat_kecamatan: siswa?.alamat_siswa?.kecamatan || '',
        alamat_kota: siswa?.alamat_siswa?.kota || '',
        alamat_provinsi: siswa?.alamat_siswa?.provinsi || '',
        alamat_kode_pos: siswa?.alamat_siswa?.kode_pos || '',
        tinggal_dengan: siswa?.alamat_siswa?.tinggal_dengan || 'Orang Tua',
        jarak_ke_sekolah: siswa?.alamat_siswa?.jarak_ke_sekolah || 0,
        transportasi: siswa?.alamat_siswa?.transportasi || '',

        // Orang Tua (Ayah - simplified for UI)
        ortu_nama: siswa?.orang_tua?.nama || '',
        ortu_pekerjaan: siswa?.orang_tua?.pekerjaan || '',
        ortu_penghasilan: siswa?.orang_tua?.penghasilan_bulanan || 0,
        ortu_kewarganegaraan: siswa?.orang_tua?.kewarganegaraan || 'WNI',
        ortu_pendidikan: siswa?.orang_tua?.pendidikan_terakhir || '',
        ortu_telp: siswa?.orang_tua?.no_telepon || '',

        // Wali
        wali_nama: siswa?.wali?.nama_wali || '',
        wali_hubungan: siswa?.wali?.hubungan || '',
        wali_pekerjaan: siswa?.wali?.pekerjaan_wali || '',
        wali_penghasilan: siswa?.wali?.penghasilan_bulanan || 0,
        wali_telp: siswa?.wali?.no_telp_wali || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reconstruct nested payload
        const payload: Partial<Siswa> = {
            no_induk: formData.no_induk,
            nisn: formData.nisn,
            nama: formData.nama,
            nama_panggilan: formData.nama_panggilan,
            jenis_kelamin: formData.jenis_kelamin as 'L' | 'P',
            tanggal_lahir: formData.tanggal_lahir,
            tempat_lahir: formData.tempat_lahir,
            agama: formData.agama,
            anak_ke: Number(formData.anak_ke),
            jumlah_saudara: Number(formData.jumlah_saudara),
            kewarganegaraan: formData.kewarganegaraan,
            bahasa_rumah: formData.bahasa_rumah,

            alamat_siswa: {
                ...siswa?.alamat_siswa,
                jalan: formData.alamat_jalan,
                kelurahan: formData.alamat_kelurahan,
                kecamatan: formData.alamat_kecamatan,
                kota: formData.alamat_kota,
                provinsi: formData.alamat_provinsi,
                kode_pos: formData.alamat_kode_pos,
                tinggal_dengan: formData.tinggal_dengan,
                jarak_ke_sekolah: Number(formData.jarak_ke_sekolah),
                transportasi: formData.transportasi
            } as AlamatSiswa,
            
            orang_tua: {
                ...siswa?.orang_tua,
                tipe: "ayah",
                nama: formData.ortu_nama,
                pekerjaan: formData.ortu_pekerjaan,
                penghasilan_bulanan: Number(formData.ortu_penghasilan),
                kewarganegaraan: formData.ortu_kewarganegaraan,
                pendidikan_terakhir: formData.ortu_pendidikan,
                no_telepon: formData.ortu_telp
            } as OrangTua,

            wali: {
                ...siswa?.wali,
                nama_wali: formData.wali_nama,
                hubungan: formData.wali_hubungan,
                pekerjaan_wali: formData.wali_pekerjaan,
                penghasilan_bulanan: Number(formData.wali_penghasilan),
                no_telp_wali: formData.wali_telp
            } as Wali
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Section: Data Pribadi */}
            <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>I. Keterangan Tentang Diri Siswa</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <Input label="Nama Lengkap Siswa" name="nama" value={formData.nama} onChange={handleChange} required />
                        <Input label="Nama Panggilan" name="nama_panggilan" value={formData.nama_panggilan} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Jenis Kelamin</label>
                            <select 
                                name="jenis_kelamin"
                                value={formData.jenis_kelamin}
                                onChange={handleChange}
                                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <Input label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required />
                        <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="No. Induk Siswa" name="no_induk" value={formData.no_induk} onChange={handleChange} required />
                        <Input label="NISN" name="nisn" value={formData.nisn} onChange={handleChange} required />
                        <Input label="Agama" name="agama" value={formData.agama} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="Kewarganegaraan" name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange} />
                        <Input label="Anak ke-" name="anak_ke" type="number" value={formData.anak_ke} onChange={handleChange} />
                        <Input label="Jumlah Saudara" name="jumlah_saudara" type="number" value={formData.jumlah_saudara} onChange={handleChange} />
                        <Input label="Bahasa Rumah" name="bahasa_rumah" value={formData.bahasa_rumah} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Section: Alamat */}
            <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>II. Keterangan Tempat Tinggal</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input label="Jalan / Detail Alamat" name="alamat_jalan" value={formData.alamat_jalan} onChange={handleChange} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="Kelurahan / Desa" name="alamat_kelurahan" value={formData.alamat_kelurahan} onChange={handleChange} />
                        <Input label="Kecamatan" name="alamat_kecamatan" value={formData.alamat_kecamatan} onChange={handleChange} />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="Kota / Kabupaten" name="alamat_kota" value={formData.alamat_kota} onChange={handleChange} />
                        <Input label="Provinsi" name="alamat_provinsi" value={formData.alamat_provinsi} onChange={handleChange} />
                        <Input label="Kode Pos" name="alamat_kode_pos" value={formData.alamat_kode_pos} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="Tinggal Dengan" name="tinggal_dengan" placeholder="Orang Tua / Wali / Kos" value={formData.tinggal_dengan} onChange={handleChange} />
                        <Input label="Jarak ke Sekolah (km)" name="jarak_ke_sekolah" type="number" step="0.1" value={formData.jarak_ke_sekolah} onChange={handleChange} />
                        <Input label="Transportasi" name="transportasi" placeholder="Jalan Kaki / Diantar / Angkutan Umum" value={formData.transportasi} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Section: Orang Tua */}
            <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>III. Keterangan Orang Tua</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Nama Lengkap Ayah" name="ortu_nama" value={formData.ortu_nama} onChange={handleChange} />
                    <Input label="Kewarganegaraan" name="ortu_kewarganegaraan" value={formData.ortu_kewarganegaraan} onChange={handleChange} />
                    <Input label="Pendidikan Terakhir" name="ortu_pendidikan" value={formData.ortu_pendidikan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Pekerjaan" name="ortu_pekerjaan" value={formData.ortu_pekerjaan} onChange={handleChange} />
                    <Input label="Penghasilan Per Bulan (Rp)" name="ortu_penghasilan" type="number" value={formData.ortu_penghasilan} onChange={handleChange} />
                    <Input label="No. Telepon / HP" name="ortu_telp" value={formData.ortu_telp} onChange={handleChange} />
                </div>
            </div>

            {/* Section: Wali */}
            <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>IV. Keterangan Wali</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Nama Wali" name="wali_nama" value={formData.wali_nama} onChange={handleChange} />
                    <Input label="Hubungan Keluarga" name="wali_hubungan" value={formData.wali_hubungan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Pekerjaan Wali" name="wali_pekerjaan" value={formData.wali_pekerjaan} onChange={handleChange} />
                    <Input label="Penghasilan Per Bulan (Rp)" name="wali_penghasilan" type="number" value={formData.wali_penghasilan} onChange={handleChange} />
                    <Input label="No. Telepon / HP" name="wali_telp" value={formData.wali_telp} onChange={handleChange} />
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">
                    💾 Simpan Perubahan Identitas
                </Button>
            </div>
            
        </form>
    );
};

export default TabIdentitas;

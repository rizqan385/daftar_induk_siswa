import { useState, useRef, useEffect } from 'react';
import type { Siswa, OrangTua, AlamatSiswa, Wali } from "../../../types/siswa.types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { uploadFoto } from "../../../services/siswa.service";
import api from "../../../services/api";

interface TabIdentitasProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
    section?: 'alamat' | 'pendidikan' | 'ayah' | 'ibu' | 'wali';
}

const TabIdentitas = ({ siswa, isNew, onSave, section }: TabIdentitasProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
    const [kelasList, setKelasList] = useState<any[]>([]);
    useEffect(() => { api.get('/kelas').then(r => setKelasList(r.data.data || [])).catch(() => {}); }, []);

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
        kelas_id: (siswa as any)?.kelas_id || '',

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

        // Orang Tua (Ayah)
        ortu_nama: siswa?.orang_tua?.nama || '',
        ortu_pekerjaan: siswa?.orang_tua?.pekerjaan || '',
        ortu_penghasilan: siswa?.orang_tua?.penghasilan_bulanan || 0,
        ortu_kewarganegaraan: siswa?.orang_tua?.kewarganegaraan || 'WNI',
        ortu_pendidikan: siswa?.orang_tua?.pendidikan_terakhir || '',
        ortu_telp: siswa?.orang_tua?.no_telepon || '',
        ortu_tempat_lahir: siswa?.orang_tua?.tempat_lahir || '',
        ortu_alamat: siswa?.orang_tua?.alamat || '',

        // Orang Tua (Ibu)
        ibu_nama: siswa?.orang_tua_ibu?.nama || '',
        ibu_pekerjaan: siswa?.orang_tua_ibu?.pekerjaan || '',
        ibu_penghasilan: siswa?.orang_tua_ibu?.penghasilan_bulanan || 0,
        ibu_kewarganegaraan: siswa?.orang_tua_ibu?.kewarganegaraan || 'WNI',
        ibu_pendidikan: siswa?.orang_tua_ibu?.pendidikan_terakhir || '',
        ibu_telp: siswa?.orang_tua_ibu?.no_telepon || '',
        ibu_tempat_lahir: siswa?.orang_tua_ibu?.tempat_lahir || '',
        ibu_alamat: siswa?.orang_tua_ibu?.alamat || '',

        // Wali
        wali_nama: siswa?.wali?.nama_wali || '',
        wali_hubungan: siswa?.wali?.hubungan || '',
        wali_pekerjaan: siswa?.wali?.pekerjaan_wali || '',
        wali_penghasilan: siswa?.wali?.penghasilan_bulanan || 0,
        wali_telp: siswa?.wali?.no_telp_wali || ''
    });

    // Re-sync form state when siswa data arrives from API
    useEffect(() => {
        if (!siswa) return;
        setFormData(prev => ({
            ...prev,
            no_induk: siswa.no_induk || '',
            nisn: siswa.nisn || '',
            nama: siswa.nama || '',
            nama_panggilan: siswa.nama_panggilan || '',
            jenis_kelamin: siswa.jenis_kelamin || 'L',
            tanggal_lahir: siswa.tanggal_lahir || '',
            tempat_lahir: siswa.tempat_lahir || '',
            agama: siswa.agama || '',
            anak_ke: siswa.anak_ke || 1,
            jumlah_saudara: siswa.jumlah_saudara || 0,
            kewarganegaraan: siswa.kewarganegaraan || 'WNI',
            bahasa_rumah: siswa.bahasa_rumah || 'Indonesia',
            kelas_id: (siswa as any).kelas_id || '',
            alamat_jalan: siswa.alamat_siswa?.jalan || '',
            alamat_kelurahan: siswa.alamat_siswa?.kelurahan || '',
            alamat_kecamatan: siswa.alamat_siswa?.kecamatan || '',
            alamat_kota: siswa.alamat_siswa?.kota || '',
            alamat_provinsi: siswa.alamat_siswa?.provinsi || '',
            alamat_kode_pos: siswa.alamat_siswa?.kode_pos || '',
            tinggal_dengan: siswa.alamat_siswa?.tinggal_dengan || 'Orang Tua',
            jarak_ke_sekolah: siswa.alamat_siswa?.jarak_ke_sekolah || 0,
            transportasi: siswa.alamat_siswa?.transportasi || '',
            ortu_nama: siswa.orang_tua?.nama || '',
            ortu_pekerjaan: siswa.orang_tua?.pekerjaan || '',
            ortu_penghasilan: siswa.orang_tua?.penghasilan_bulanan || 0,
            ortu_kewarganegaraan: siswa.orang_tua?.kewarganegaraan || 'WNI',
            ortu_pendidikan: siswa.orang_tua?.pendidikan_terakhir || '',
            ortu_telp: siswa.orang_tua?.no_telepon || '',
            ortu_tempat_lahir: siswa.orang_tua?.tempat_lahir || '',
            ortu_alamat: siswa.orang_tua?.alamat || '',
            ibu_nama: siswa.orang_tua_ibu?.nama || '',
            ibu_pekerjaan: siswa.orang_tua_ibu?.pekerjaan || '',
            ibu_penghasilan: siswa.orang_tua_ibu?.penghasilan_bulanan || 0,
            ibu_kewarganegaraan: siswa.orang_tua_ibu?.kewarganegaraan || 'WNI',
            ibu_pendidikan: siswa.orang_tua_ibu?.pendidikan_terakhir || '',
            ibu_telp: siswa.orang_tua_ibu?.no_telepon || '',
            ibu_tempat_lahir: siswa.orang_tua_ibu?.tempat_lahir || '',
            ibu_alamat: siswa.orang_tua_ibu?.alamat || '',
            wali_nama: siswa.wali?.nama_wali || '',
            wali_hubungan: siswa.wali?.hubungan || '',
            wali_pekerjaan: siswa.wali?.pekerjaan_wali || '',
            wali_penghasilan: siswa.wali?.penghasilan_bulanan || 0,
            wali_telp: siswa.wali?.no_telp_wali || ''
        }));
    }, [siswa]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhotoPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        if (siswa && !isNew) {
            handlePhotoUpload(file);
        }
    };

    const handlePhotoUpload = async (file: File) => {
        if (!siswa) return;
        setIsUploading(true);
        setUploadMsg('');
        try {
            await uploadFoto(siswa.id, file);
            setUploadMsg('✅ Foto berhasil diupload!');
        } catch (err: any) {
            setUploadMsg('❌ Gagal upload foto: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate NISN: must be numeric
        const nisnValue = formData.nisn.trim();
        if (!/^\d+$/.test(nisnValue)) {
            alert('NISN harus berupa angka.');
            return;
        }

        // Validate no_induk: alphanumeric + dash/slash, 5-20 chars
        const noIndukValue = formData.no_induk.trim();
        if (noIndukValue.length < 5 || !/^[A-Za-z0-9\-\/]+$/.test(noIndukValue)) {
            alert('No. Induk Siswa harus terdiri dari 5-20 karakter alfanumerik (boleh ada tanda - atau /).');
            return;
        }
        
        // Reconstruct nested payload
        const payload: Partial<Siswa> = {
            no_induk: noIndukValue,
            nisn: nisnValue,
            nama: formData.nama,
            nama_panggilan: formData.nama_panggilan,
            jenis_kelamin: formData.jenis_kelamin as 'L' | 'P',
            tanggal_lahir: formData.tanggal_lahir,
            tempat_lahir: formData.tempat_lahir,
            agama: formData.agama,
            anak_ke: Math.max(1, Number(formData.anak_ke) || 1),
            jumlah_saudara: Number(formData.jumlah_saudara) || 0,
            kewarganegaraan: formData.kewarganegaraan || 'Indonesia',
            bahasa_rumah: formData.bahasa_rumah || 'Indonesia',
            ...(formData.kelas_id ? { kelas_id: Number(formData.kelas_id) } : {}),

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
                no_telepon: formData.ortu_telp,
                tempat_lahir: formData.ortu_tempat_lahir,
                alamat: formData.ortu_alamat
            } as OrangTua,

            orang_tua_ibu: {
                ...siswa?.orang_tua_ibu,
                tipe: "ibu",
                nama: formData.ibu_nama,
                pekerjaan: formData.ibu_pekerjaan,
                penghasilan_bulanan: Number(formData.ibu_penghasilan),
                kewarganegaraan: formData.ibu_kewarganegaraan,
                pendidikan_terakhir: formData.ibu_pendidikan,
                no_telepon: formData.ibu_telp,
                tempat_lahir: formData.ibu_tempat_lahir,
                alamat: formData.ibu_alamat
            } as any,

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

    const currentFotoUrl = siswa?.foto_path ? `${API_BASE}/uploads/${siswa.foto_path}` : null;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Section: Photo Upload */}
            {(!section) && !isNew && (
                <div>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>📷 Foto Siswa</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Photo display */}
                        <div style={{
                            width: '120px',
                            height: '150px',
                            borderRadius: '12px',
                            border: '2px dashed var(--border-color)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(15, 23, 42, 0.4)',
                            flexShrink: 0
                        }}>
                            {(photoPreview || currentFotoUrl) ? (
                                <img
                                    src={photoPreview || currentFotoUrl || ''}
                                    alt="Foto Siswa"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👤</div>
                                    Belum ada foto
                                </div>
                            )}
                        </div>

                        {/* Upload controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                ref={fileInputRef}
                                onChange={handlePhotoSelect}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: isUploading ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                                    color: '#60a5fa',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isUploading ? '⏳ Mengupload...' : '📤 Upload Foto'}
                            </button>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                                Format: JPEG, PNG, GIF, WebP (Maks 5MB)
                            </p>
                            {uploadMsg && (
                                <p style={{
                                    fontSize: '0.85rem',
                                    margin: 0,
                                    color: uploadMsg.startsWith('✅') ? '#34d399' : '#fb7185'
                                }}>
                                    {uploadMsg}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Section: Data Pribadi */}
            {(!section) && (<div>
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
                        <Input label="No. Induk Siswa" name="no_induk" value={formData.no_induk} onChange={handleChange} required maxLength={20} placeholder="Contoh: 2024001" />
                        <Input label="NISN" name="nisn" value={formData.nisn} onChange={handleChange} required maxLength={20} pattern="\d+" title="Hanya angka" placeholder="Contoh: 0012345678" />
                        <Input label="Agama" name="agama" value={formData.agama} onChange={handleChange} required placeholder="Contoh: Islam" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <Input label="Kewarganegaraan" name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange} />
                        <Input label="Anak ke-" name="anak_ke" type="number" value={formData.anak_ke} onChange={handleChange} />
                        <Input label="Jumlah Saudara" name="jumlah_saudara" type="number" value={formData.jumlah_saudara} onChange={handleChange} />
                        <Input label="Bahasa Rumah" name="bahasa_rumah" value={formData.bahasa_rumah} onChange={handleChange} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kelas</label>
                            <select 
                                name="kelas_id"
                                value={formData.kelas_id}
                                onChange={handleChange}
                                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', color: 'var(--text-primary)' }}
                            >
                                <option value="">Pilih Kelas</option>
                                {kelasList.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Section: Alamat */}
            {(!section || section === 'alamat') && (<div>
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
            )}

            {/* Section: Ayah */}
            {(!section || section === 'ayah') && (<div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>III. Keterangan Ayah</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Nama Lengkap Ayah" name="ortu_nama" value={formData.ortu_nama} onChange={handleChange} />
                    <Input label="Tempat Lahir" name="ortu_tempat_lahir" value={formData.ortu_tempat_lahir} onChange={handleChange} />
                    <Input label="Kewarganegaraan" name="ortu_kewarganegaraan" value={formData.ortu_kewarganegaraan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Pendidikan Terakhir" name="ortu_pendidikan" value={formData.ortu_pendidikan} onChange={handleChange} />
                    <Input label="Pekerjaan" name="ortu_pekerjaan" value={formData.ortu_pekerjaan} onChange={handleChange} />
                    <Input label="Penghasilan Per Bulan (Rp)" name="ortu_penghasilan" type="number" value={formData.ortu_penghasilan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Alamat" name="ortu_alamat" value={formData.ortu_alamat} onChange={handleChange} />
                    <Input label="No. Telepon / HP" name="ortu_telp" value={formData.ortu_telp} onChange={handleChange} />
                </div>
            </div>
            )}

            {/* Section: Ibu */}
            {(!section || section === 'ibu') && (<div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>IV. Keterangan Ibu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <Input label="Nama Lengkap Ibu" name="ibu_nama" value={formData.ibu_nama} onChange={handleChange} />
                    <Input label="Tempat Lahir" name="ibu_tempat_lahir" value={formData.ibu_tempat_lahir} onChange={handleChange} />
                    <Input label="Kewarganegaraan" name="ibu_kewarganegaraan" value={formData.ibu_kewarganegaraan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Pendidikan Terakhir" name="ibu_pendidikan" value={formData.ibu_pendidikan} onChange={handleChange} />
                    <Input label="Pekerjaan" name="ibu_pekerjaan" value={formData.ibu_pekerjaan} onChange={handleChange} />
                    <Input label="Penghasilan Per Bulan (Rp)" name="ibu_penghasilan" type="number" value={formData.ibu_penghasilan} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <Input label="Alamat" name="ibu_alamat" value={formData.ibu_alamat} onChange={handleChange} />
                    <Input label="No. Telepon / HP" name="ibu_telp" value={formData.ibu_telp} onChange={handleChange} />
                </div>
            </div>
            )}

            {/* Section: Wali */}
            {(!section || section === 'wali') && (<div>
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
            )}

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

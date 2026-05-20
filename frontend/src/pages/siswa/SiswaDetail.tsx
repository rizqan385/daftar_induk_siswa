import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSiswaById } from "../../hooks/useSiswa";
import {
    createSiswa as createSiswaService,
    updateSiswa as updateSiswaService,
    createOrUpdateAlamat as createOrUpdateAlamatService,
    addOrangTua as addOrangTuaService,
    updateOrangTua as updateOrangTuaService,
    createOrUpdateWali as createOrUpdateWaliService,
    createOrUpdateKesehatan as createOrUpdateKesehatanService,
    addRiwayatPenyakit as addRiwayatPenyakitService,
    deleteRiwayatPenyakit as deleteRiwayatPenyakitService,
    addPendidikan as addPendidikanService,
    updatePendidikan as updatePendidikanService,
    deletePendidikan as deletePendidikanService,
    addKepribadian as addKepribadianService,
    updateKepribadian as updateKepribadianService,
    deleteKepribadian as deleteKepribadianService,
    addPrestasi as addPrestasiService,
    updatePrestasi as updatePrestasiService,
    deletePrestasi as deletePrestasiService,
    addBeasiswa as addBeasiswaService,
    updateBeasiswa as updateBeasiswaService,
    deleteBeasiswa as deleteBeasiswaService,
    createCatatanSemester as createCatatanSemesterService,
    updateCatatanSemester as updateCatatanSemesterService,
    addPKL as addPKLService,
    updatePKL as updatePKLService,
    deletePKL as deletePKLService,
    addEkstrakurikuler as addEkstrakurikulerService,
    updateEkstrakurikuler as updateEkstrakurikulerService,
    deleteEkstrakurikuler as deleteEkstrakurikulerService,
    addMeninggalkanSekolah as addMeninggalkanSekolahService,
    deleteMeninggalkanSekolah as deleteMeninggalkanSekolahService,
    createNilaiSemester as createNilaiSemesterService,
    updateNilaiSemester as updateNilaiSemesterService,
    deleteNilaiSemester as deleteNilaiSemesterService,
    createNilaiSikap as createNilaiSikapService,
    createKehadiran as createKehadiranService,
    createNilaiIjazah as createNilaiIjazahService
} from "../../services/siswa.service";
import Swal from 'sweetalert2';
import TabIdentitas from "./tabs/TabIdentitas";
import TabAkademik from "./tabs/TabAkademik";
import TabKesehatan from "./tabs/TabKesehatan";
import TabCatatan from "./tabs/TabCatatan";
import TabLainnya from "./tabs/TabLainnya";
import TabKepribadian from "./tabs/TabKepribadian";
import TabPemeriksaanBuku from "./tabs/TabPemeriksaanBuku";
import TabMeninggalkanSekolah from "./tabs/TabMeninggalkanSekolah";
import TabPerkembangan from "./tabs/TabPerkembangan";
import TabPendidikan from "./tabs/TabPendidikan";
import type { Siswa } from "../../types/siswa.types";
import Button from "../../components/ui/Button";

const tabs = [
    { id: 'pribadi', label: 'A. Pribadi' },
    { id: 'alamat', label: 'B. Tempat Tinggal' },
    { id: 'kesehatan', label: 'C. Kesehatan' },
    { id: 'pendidikan', label: 'D. Pendidikan' },
    { id: 'ayah', label: 'E. Ayah' },
    { id: 'ibu', label: 'F. Ibu' },
    { id: 'wali', label: 'G. Wali' },
    { id: 'perkembangan', label: 'H. Perkembangan' },
    { id: 'lainnya', label: 'I. Keterangan Lain' },
    { id: 'keluar', label: 'J. Keluar' }
];

const SiswaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';
    const tabsRef = useRef<HTMLDivElement>(null);
    
    const numericId = isNew ? undefined : Number(id);
    const { data: siswaData, isLoading } = useSiswaById(numericId);
    const [dataVersion, setDataVersion] = useState(0);

    // When API data arrives, force all tabs to remount with correct data
    // Tab components use useState initialized from props — without this,
    // they initialize with undefined (while API is loading) and stay empty
    useEffect(() => {
        if (siswaData) {
            setDataVersion(v => v + 1);
        }
    }, [siswaData]);

    // Map API response to the Siswa type expected by tabs
    const siswa: Siswa | undefined = siswaData ? {
        id: siswaData.id,
        no_induk: siswaData.no_induk || '',
        nisn: siswaData.nisn || '',
        nama: siswaData.nama || '',
        nama_panggilan: siswaData.nama_panggilan || '',
        jenis_kelamin: (siswaData.jenis_kelamin as 'L' | 'P') || 'L',
        tempat_lahir: siswaData.tempat_lahir || '',
        tanggal_lahir: siswaData.tanggal_lahir ? siswaData.tanggal_lahir.substring(0, 10) : '',
        agama: siswaData.agama || '',
        anak_ke: siswaData.anak_ke || 1,
        jumlah_saudara: siswaData.jumlah_saudara || 0,
        kewarganegaraan: siswaData.kewarganegaraan || 'Indonesia',
        bahasa_rumah: siswaData.bahasa_rumah || 'Indonesia',
        kelas_id: (siswaData as any).kelas_id,
        status: siswaData.status || 'aktif',
        foto_path: siswaData.foto_path || '',
        alamat_siswa: siswaData.alamat ? {
            id: siswaData.alamat.id || 0,
            alamat_lengkap: siswaData.alamat.alamat_lengkap || '',
            jalan: siswaData.alamat.alamat_lengkap || '',
            kelurahan: siswaData.alamat.kelurahan || '',
            kecamatan: siswaData.alamat.kecamatan || '',
            kota: siswaData.alamat.kota || '',
            provinsi: siswaData.alamat.provinsi || '',
            kode_pos: siswaData.alamat.kode_pos || '',
            no_telepon: siswaData.alamat.no_telepon || '',
            tinggal_dengan: siswaData.alamat.tinggal_dengan || '',
            jarak_ke_sekolah: siswaData.alamat.jarak_ke_sekolah || 0,
            transportasi: siswaData.alamat.transportasi || '',
        } : { id: 0, jalan: '', kelurahan: '', kecamatan: '', kota: '', provinsi: '', kode_pos: '' },
        orang_tua: siswaData.orang_tua?.[0] ? {
            id: siswaData.orang_tua[0].id || 0,
            tipe: siswaData.orang_tua[0].tipe || 'ayah',
            nama: siswaData.orang_tua[0].nama || '',
            tempat_lahir: siswaData.orang_tua[0].tempat_lahir || '',
            tanggal_lahir: siswaData.orang_tua[0].tanggal_lahir || '',
            kewarganegaraan: siswaData.orang_tua[0].kewarganegaraan || 'Indonesia',
            pendidikan_terakhir: siswaData.orang_tua[0].pendidikan_terakhir || '',
            pekerjaan: siswaData.orang_tua[0].pekerjaan || '',
            penghasilan_bulanan: siswaData.orang_tua[0].penghasilan_bulanan || 0,
            alamat: siswaData.orang_tua[0].alamat || '',
            no_telepon: siswaData.orang_tua[0].no_telepon || '',
            masih_hidup: siswaData.orang_tua[0].masih_hidup ?? true,
        } : { id: 0, nama: '', pekerjaan: '' },
        orang_tua_ibu: siswaData.orang_tua?.[1] ? {
            id: siswaData.orang_tua[1].id || 0,
            tipe: 'ibu' as const,
            nama: siswaData.orang_tua[1].nama || '',
            tempat_lahir: siswaData.orang_tua[1].tempat_lahir || '',
            tanggal_lahir: siswaData.orang_tua[1].tanggal_lahir || '',
            kewarganegaraan: siswaData.orang_tua[1].kewarganegaraan || 'Indonesia',
            pendidikan_terakhir: siswaData.orang_tua[1].pendidikan_terakhir || '',
            pekerjaan: siswaData.orang_tua[1].pekerjaan || '',
            penghasilan_bulanan: siswaData.orang_tua[1].penghasilan_bulanan || 0,
            alamat: siswaData.orang_tua[1].alamat || '',
            no_telepon: siswaData.orang_tua[1].no_telepon || '',
            masih_hidup: siswaData.orang_tua[1].masih_hidup ?? true,
        } : { id: 0, nama: '', pekerjaan: '', tipe: 'ibu' as const },
        wali: siswaData.wali ? {
            id: siswaData.wali.id || 0,
            nama_wali: siswaData.wali.nama || '',
            jenis_kelamin: siswaData.wali.jenis_kelamin || 'L',
            tempat_lahir: siswaData.wali.tempat_lahir || '',
            tanggal_lahir: siswaData.wali.tanggal_lahir || '',
            kewarganegaraan: siswaData.wali.kewarganegaraan || 'Indonesia',
            pendidikan_terakhir: siswaData.wali.pendidikan_terakhir || '',
            pekerjaan_wali: siswaData.wali.pekerjaan || '',
            penghasilan_bulanan: siswaData.wali.penghasilan_bulanan || 0,
            alamat: siswaData.wali.alamat || '',
            no_telp_wali: siswaData.wali.no_telepon || '',
            hubungan: siswaData.wali.hubungan_dengan_siswa || '',
        } : { id: 0, nama_wali: '', hubungan: '', pekerjaan_wali: '', no_telp_wali: '' },
        kesehatan_siswa: siswaData.kesehatan ? {
            id: siswaData.kesehatan.id || 0,
            berat_badan: siswaData.kesehatan.berat_badan_masuk || 0,
            tinggi_badan: siswaData.kesehatan.tinggi_badan_masuk || 0,
            berat_badan_keluar: siswaData.kesehatan.berat_badan_keluar || 0,
            tinggi_badan_keluar: siswaData.kesehatan.tinggi_badan_keluar || 0,
            golongan_darah: siswaData.kesehatan.golongan_darah || '',
            kesanggupan_jasmani: siswaData.kesehatan.kesanggupan_jasmani || '',
        } : { id: 0, berat_badan: 0, tinggi_badan: 0, golongan_darah: '' },
        pendidikan_sebelumnya: (siswaData.pendidikan_sebelumnya || []).map((p: any) => ({
            id: p.id, tipe: p.tipe || 'siswa_baru', tanggal_diterima: p.tanggal_diterima?.substring(0, 10) || '',
            nama_sekolah: p.asal_sekolah || '', alamat_sekolah: p.alamat_sekolah || '',
            no_ijazah: p.no_ijazah || '', tanggal_ijazah: p.tanggal_ijazah?.substring(0, 10) || '',
            no_skhun: p.no_skhun || '', tanggal_skhun: p.tanggal_skhun?.substring(0, 10) || '',
            kelas_diterima: p.kelas_diterima || 'X', alasan_pindah: p.alasan_pindah || '',
        })),
        nilai_semester: (siswaData.nilai_semester || []).map((n: any) => ({
            id: n.id, mata_pelajaran_id: n.mata_pelajaran?.id || 0, mata_pelajaran: n.mata_pelajaran ? {
                id: n.mata_pelajaran.id, nama_mapel: n.mata_pelajaran.nama,
                kelompok_mapel: n.mata_pelajaran.kelompok, keterangan: ''
            } : undefined,
            kelas: n.kelas, semester: n.semester, tahun_pelajaran: n.tahun_pelajaran,
            nilai_pengetahuan: n.nilai_pengetahuan, predikat_pengetahuan: n.predikat_pengetahuan,
            deskripsi_pengetahuan: n.deskripsi_pengetahuan,
            nilai_keterampilan: n.nilai_keterampilan, predikat_keterampilan: n.predikat_keterampilan,
            deskripsi_keterampilan: n.deskripsi_keterampilan,
        })),
        nilai_sikap: (siswaData.nilai_sikap || []).map((s: any) => ({
            id: s.id, kelas: s.kelas || 'X', semester: s.semester || 1,
            deskripsi_spiritual: s.deskripsi_spiritual || '', deskripsi_sosial: s.deskripsi_sosial || '',
        })),
        kehadiran: siswaData.kehadiran || [],
        riwayat_penyakit: (siswaData.kesehatan?.riwayat_penyakit || []).map((r: any) => ({
            id: r.id, nama_penyakit: r.jenis_penyakit, tahun_sakit: String(r.tahun),
            lama_sakit: r.lama_sakit, keterangan: r.keterangan,
        })),
        catatan_semester: (siswaData.catatan_semester || []).map((c: any) => ({
            id: c.id, kelas: c.kelas, semester: c.semester, catatan_wali_kelas: c.catatan_wali_kelas || '',
            pkl: (c.pkl || []).map((p: any) => ({ id: p.id, nama_dudi: p.nama_dudi, lokasi: p.lokasi, lama_bulan: Number(p.lama_bulan) || 0, keterangan: p.keterangan })),
            ekstrakurikuler: (c.ekstrakurikuler || []).map((e: any) => ({ id: e.id, nama_ekskul: e.nama_kegiatan, nilai: '', deskripsi: e.keterangan })),
            prestasi_semester: (c.prestasi_semester || []).map((ps: any) => ({ id: ps.id, nama_prestasi: ps.jenis_prestasi, keterangan: ps.keterangan })),
            ketidakhadiran_catatan: c.ketidakhadiran ? { id: c.ketidakhadiran.id, karena_sakit: c.ketidakhadiran.karena_sakit, dengan_izin: c.ketidakhadiran.dengan_izin, tanpa_keterangan: c.ketidakhadiran.tanpa_keterangan } : undefined,
        })),
        prestasi: (siswaData.prestasi || []).map((p: any) => ({
            id: p.id, nama_prestasi: p.keterangan || p.bidang, bidang: p.bidang,
            tingkat: p.tingkat, tahun: String(p.tahun || ''), keterangan: p.keterangan,
        })),
        beasiswa: (siswaData.beasiswa || []).map((b: any) => ({
            id: b.id, tahun_pelajaran: b.tahun_pelajaran || '',
            pemberi: b.pemberi || '', keterangan: b.keterangan || '',
        })),
        kepribadian: (siswaData.kepribadian || []).map((k: any) => ({
            id: k.id, aspek: k.aspek || '', nilai: k.nilai || '', tahun_pelajaran: k.tahun_pelajaran || '',
        })),
        pemeriksaan_buku: [],
        meninggalkan_sekolah: siswaData.meninggalkan_sekolah ? {
            id: siswaData.meninggalkan_sekolah.id,
            tipe: siswaData.meninggalkan_sekolah.tipe,
            tanggal_keluar: (siswaData.meninggalkan_sekolah.tanggal_keluar || siswaData.meninggalkan_sekolah.tanggal || '').substring(0, 10),
            sekolah_tujuan: siswaData.meninggalkan_sekolah.sekolah_tujuan,
            alamat_sekolah_tujuan: siswaData.meninggalkan_sekolah.alamat_sekolah_tujuan,
            no_ijazah: siswaData.meninggalkan_sekolah.no_ijazah,
            alasan: siswaData.meninggalkan_sekolah.alasan,
            tujuan: siswaData.meninggalkan_sekolah.sekolah_tujuan || '',
        } : undefined,
    } : undefined;

    const [activeTab, setActiveTab] = useState('pribadi');

    const handleSaveSiswaInfo = async (partialData: Partial<Siswa>) => {
        try {
            // Helper: semester 1-2 = X, 3-4 = XI, 5-6 = XII
            const semesterToKelas = (sem: number): string => {
                if (sem <= 2) return 'X';
                if (sem <= 4) return 'XI';
                return 'XII';
            };
            let currentSiswaId = siswa?.id;
            const isNewId = (id: any) => !id || Number(id) > 100000000;
            const toDateStr = (d?: string) => {
                if (!d) return new Date().toISOString().substring(0, 10);
                return d.substring(0, 10);
            };

            // Only update base siswa fields if identitas data is present
            const hasBaseFields = partialData.nama !== undefined;

            if (isNew && hasBaseFields) {
                const apiPayload: any = {
                    no_induk: partialData.no_induk,
                    nisn: partialData.nisn,
                    nama: partialData.nama,
                    nama_panggilan: partialData.nama_panggilan,
                    jenis_kelamin: partialData.jenis_kelamin,
                    tempat_lahir: partialData.tempat_lahir,
                    tanggal_lahir: partialData.tanggal_lahir,
                    agama: partialData.agama,
                    anak_ke: partialData.anak_ke || 1,
                    jumlah_saudara: partialData.jumlah_saudara || 0,
                    kewarganegaraan: partialData.kewarganegaraan || 'Indonesia',
                    bahasa_rumah: partialData.bahasa_rumah || 'Indonesia',
                    ...(partialData.kelas_id ? { kelas_id: partialData.kelas_id } : {})
                };
                const response = await createSiswaService(apiPayload);
                currentSiswaId = response.id;
            } else if (hasBaseFields && siswa) {
                const apiPayload: any = {
                    nama: partialData.nama,
                    nama_panggilan: partialData.nama_panggilan,
                    jenis_kelamin: partialData.jenis_kelamin,
                    tempat_lahir: partialData.tempat_lahir,
                    tanggal_lahir: partialData.tanggal_lahir,
                    agama: partialData.agama,
                    anak_ke: partialData.anak_ke,
                    jumlah_saudara: partialData.jumlah_saudara,
                    kewarganegaraan: partialData.kewarganegaraan,
                    bahasa_rumah: partialData.bahasa_rumah,
                    ...(partialData.kelas_id ? { kelas_id: partialData.kelas_id } : {})
                };
                await updateSiswaService(currentSiswaId!, apiPayload);

            }

            if (!currentSiswaId) throw new Error("ID Siswa tidak ditemukan");
            const siswaId = currentSiswaId;

            // If saving from a non-identitas tab (like Pendidikan) that includes a class update, update the base Siswa
            if (!hasBaseFields && partialData.kelas_id) {
                await updateSiswaService(siswaId, { kelas_id: partialData.kelas_id });
            }

            // --- 1. IDENTITAS (Alamat, Orang Tua, Wali) ---
            if (partialData.alamat_siswa) {
                const a = partialData.alamat_siswa;
                await createOrUpdateAlamatService(siswaId, {
                    alamat_lengkap: a.jalan || '', kelurahan: a.kelurahan || '', kecamatan: a.kecamatan || '',
                    kota: a.kota || '', provinsi: a.provinsi || '', kode_pos: a.kode_pos || '',
                    no_telepon: a.no_telepon || '', tinggal_dengan: a.tinggal_dengan || '',
                    jarak_ke_sekolah: Number(a.jarak_ke_sekolah) || 0, transportasi: a.transportasi || '',
                });
            }

            if (partialData.orang_tua && partialData.orang_tua.nama) {
                const ot = partialData.orang_tua;
                const ortuPayload = {
                    tipe: ot.tipe || 'ayah', nama: ot.nama, pekerjaan: ot.pekerjaan || '',
                    penghasilan_bulanan: Number(ot.penghasilan_bulanan) || 0, kewarganegaraan: ot.kewarganegaraan || 'Indonesia',
                    pendidikan_terakhir: ot.pendidikan_terakhir || '', no_telepon: ot.no_telepon || '',
                    tempat_lahir: ot.tempat_lahir || '', alamat: ot.alamat || ''
                };
                if (ot.id && ot.id > 0 && !isNew) await updateOrangTuaService(ot.id, ortuPayload);
                else await addOrangTuaService(siswaId, ortuPayload);
            }

            if (partialData.orang_tua_ibu && partialData.orang_tua_ibu.nama) {
                const ibu = partialData.orang_tua_ibu;
                const ibuPayload = {
                    tipe: 'ibu', nama: ibu.nama, pekerjaan: ibu.pekerjaan || '',
                    penghasilan_bulanan: Number(ibu.penghasilan_bulanan) || 0, kewarganegaraan: ibu.kewarganegaraan || 'Indonesia',
                    pendidikan_terakhir: ibu.pendidikan_terakhir || '', no_telepon: ibu.no_telepon || '',
                    tempat_lahir: ibu.tempat_lahir || '', alamat: ibu.alamat || ''
                };
                if (ibu.id && ibu.id > 0 && !isNew) await updateOrangTuaService(ibu.id, ibuPayload);
                else await addOrangTuaService(siswaId, ibuPayload);
            }

            if (partialData.wali && partialData.wali.nama_wali) {
                const w = partialData.wali;
                await createOrUpdateWaliService(siswaId, {
                    nama_wali: w.nama_wali,
                    jenis_kelamin: w.jenis_kelamin || 'L',
                    hubungan: w.hubungan || '',
                    pekerjaan_wali: w.pekerjaan_wali || '',
                    penghasilan_bulanan: Number(w.penghasilan_bulanan) || 0,
                    no_telp_wali: w.no_telp_wali || '',
                });
            }

            // --- 2. KESEHATAN ---
            if (partialData.kesehatan_siswa) {
                const ks = partialData.kesehatan_siswa;
                const resKesehatan = await createOrUpdateKesehatanService(siswaId, {
                    berat_badan: Number(ks.berat_badan) || 0,
                    tinggi_badan: Number(ks.tinggi_badan) || 0,
                    berat_badan_keluar: Number(ks.berat_badan_keluar) || 0,
                    tinggi_badan_keluar: Number(ks.tinggi_badan_keluar) || 0,
                    golongan_darah: ks.golongan_darah || '',
                    kesanggupan_jasmani: ks.kesanggupan_jasmani || ''
                });
                
                if (partialData.riwayat_penyakit) {
                    const kesehatanId = resKesehatan.id;
                    const oldRp = siswa?.riwayat_penyakit || [];
                    const newRp = partialData.riwayat_penyakit;
                    for (const rp of newRp.filter((x: any) => isNewId(x.id))) {
                        await addRiwayatPenyakitService(kesehatanId, {
                            nama_penyakit: rp.nama_penyakit,
                            tahun_sakit: Number(rp.tahun_sakit) || 0,
                            keterangan: rp.keterangan || '',
                            lama_sakit: rp.lama_sakit || ''
                        });
                    }
                    for (const rp of oldRp.filter((x: any) => !newRp.find((y: any) => y.id === x.id))) {
                        await deleteRiwayatPenyakitService(rp.id);
                    }
                }
            }

            // --- 3. AKADEMIK ---
            if (partialData.pendidikan_sebelumnya) {
                const old = siswa?.pendidikan_sebelumnya || [];
                const curr = partialData.pendidikan_sebelumnya;
                for (const item of curr.filter((x: any) => isNewId(x.id))) {
                    await addPendidikanService(siswaId, {
                        tipe: item.tipe || 'siswa_baru',
                        tanggal_diterima: toDateStr(item.tanggal_diterima),
                        nama_sekolah: item.nama_sekolah || '',
                        alamat_sekolah: item.alamat_sekolah || '',
                        kelas_diterima: item.kelas_diterima || 'X',
                        no_ijazah: item.no_ijazah || '',
                        tanggal_ijazah: item.tanggal_ijazah ? toDateStr(item.tanggal_ijazah) : undefined,
                        no_skhun: item.no_skhun || '',
                        tanggal_skhun: item.tanggal_skhun ? toDateStr(item.tanggal_skhun) : undefined,
                        alasan_pindah: item.alasan_pindah || '',
                    });
                }
                for (const item of curr.filter((x: any) => !isNewId(x.id))) {
                    await updatePendidikanService(item.id, {
                        tipe: item.tipe || 'siswa_baru',
                        nama_sekolah: item.nama_sekolah || '',
                        alamat_sekolah: item.alamat_sekolah || '',
                        tanggal_diterima: toDateStr(item.tanggal_diterima),
                        kelas_diterima: item.kelas_diterima || 'X',
                        no_ijazah: item.no_ijazah || '',
                        tanggal_ijazah: item.tanggal_ijazah ? toDateStr(item.tanggal_ijazah) : undefined,
                        no_skhun: item.no_skhun || '',
                        tanggal_skhun: item.tanggal_skhun ? toDateStr(item.tanggal_skhun) : undefined,
                        alasan_pindah: item.alasan_pindah || '',
                    });
                }
                for (const item of old.filter((x: any) => !curr.find((y: any) => y.id === x.id))) {
                    await deletePendidikanService(item.id);
                }
            }

            // --- 4. AKADEMIK (Nilai, Sikap, Kehadiran, Ijazah) ---
            if (partialData.nilai_semester) {
                const oldNilai = siswa?.nilai_semester || [];
                const currNilai = partialData.nilai_semester;
                // Create new items
                for (const n of currNilai.filter((x: any) => isNewId(x.id))) {
                    if ((n.mata_pelajaran_id || n.mata_pelajaran?.id || 0) > 0) {
                        await createNilaiSemesterService(siswaId, {
                            mata_pelajaran_id: n.mata_pelajaran_id || n.mata_pelajaran?.id || 0,
                            kelas: n.kelas || semesterToKelas(n.semester),
                            semester: n.semester || 1,
                            tahun_pelajaran: n.tahun_pelajaran || '',
                            nilai_pengetahuan: Number(n.nilai_pengetahuan) || 0,
                            predikat_pengetahuan: n.predikat_pengetahuan || '',
                            deskripsi_pengetahuan: n.deskripsi_pengetahuan || '',
                            nilai_keterampilan: Number(n.nilai_keterampilan) || 0,
                            predikat_keterampilan: n.predikat_keterampilan || '',
                            deskripsi_keterampilan: n.deskripsi_keterampilan || ''
                        });
                    }
                }
                // Update existing items
                for (const n of currNilai.filter((x: any) => !isNewId(x.id))) {
                    await updateNilaiSemesterService(n.id, {
                        tahun_pelajaran: n.tahun_pelajaran || '',
                        nilai_pengetahuan: Number(n.nilai_pengetahuan) || 0,
                        predikat_pengetahuan: n.predikat_pengetahuan || '',
                        deskripsi_pengetahuan: n.deskripsi_pengetahuan || '',
                        nilai_keterampilan: Number(n.nilai_keterampilan) || 0,
                        predikat_keterampilan: n.predikat_keterampilan || '',
                        deskripsi_keterampilan: n.deskripsi_keterampilan || ''
                    });
                }
                // Delete removed items
                for (const n of oldNilai.filter((x: any) => !currNilai.find((y: any) => y.id === x.id))) {
                    await deleteNilaiSemesterService(n.id);
                }
            }
            if (partialData.nilai_sikap) {
                for (const sikap of partialData.nilai_sikap) {
                    if (sikap.deskripsi_spiritual || sikap.deskripsi_sosial) {
                        await createNilaiSikapService(siswaId, {
                            kelas: sikap.kelas || semesterToKelas(sikap.semester),
                            semester: sikap.semester || 1,
                            deskripsi_spiritual: sikap.deskripsi_spiritual || '',
                            deskripsi_sosial: sikap.deskripsi_sosial || ''
                        });
                    }
                }
            }
            if (partialData.kehadiran) {
                for (const hadir of partialData.kehadiran) {
                    if (hadir.jumlah_hadir !== undefined) {
                        await createKehadiranService(siswaId, {
                            kelas: hadir.kelas || semesterToKelas(hadir.semester),
                            semester: hadir.semester || 1,
                            jumlah_hadir: Number(hadir.jumlah_hadir) || 0,
                            persentase_hadir: Number(hadir.persentase_hadir) || 0,
                            jumlah_sakit: Number(hadir.jumlah_sakit) || 0,
                            jumlah_izin: Number(hadir.jumlah_izin) || 0,
                            jumlah_alpa: Number(hadir.jumlah_alpa) || 0,
                            jumlah_hari_efektif: Number(hadir.jumlah_hari_efektif) || 0
                        });
                    }
                }
            }
            if (partialData.nilai_ijazah) {
                const ijazah = partialData.nilai_ijazah;
                if (ijazah.mata_pelajaran_id) {
                    await createNilaiIjazahService(siswaId, {
                        mata_pelajaran_id: ijazah.mata_pelajaran_id,
                        nilai_akhir: Number(ijazah.nilai_rata_rata || ijazah.nilai_akhir) || 0,
                        tahun_lulus: ijazah.tahun_lulus || '',
                        no_ijazah: ijazah.nomor_ijazah || ijazah.no_ijazah || '',
                        tanggal_lulus: toDateStr(ijazah.tanggal_lulus)
                    });
                }
            }

            // --- 5. KEPRIBADIAN ---
            if (partialData.kepribadian) {
                const old = siswa?.kepribadian || [];
                const curr = partialData.kepribadian;
                // Create new items
                for (const item of curr.filter((x: any) => isNewId(x.id))) {
                    await addKepribadianService(siswaId, { aspek: item.aspek || '', nilai: item.nilai || 'Baik', tahun_pelajaran: item.tahun_pelajaran || '' });
                }
                // Update existing items
                for (const item of curr.filter((x: any) => !isNewId(x.id))) {
                    await updateKepribadianService(item.id, { aspek: item.aspek || '', nilai: item.nilai || 'Baik', tahun_pelajaran: item.tahun_pelajaran || '' });
                }
                // Delete removed items
                for (const item of old.filter((x: any) => !curr.find((y: any) => y.id === x.id))) {
                    await deleteKepribadianService(item.id);
                }
            }

            // --- 5b. PRESTASI & BEASISWA ---
            if (partialData.prestasi) {
                const old = siswa?.prestasi || [];
                const curr = partialData.prestasi;
                for (const item of curr.filter((x: any) => isNewId(x.id))) {
                    await addPrestasiService(siswaId, { bidang: item.bidang || 'Lainnya', nama_prestasi: item.nama_prestasi || '', tingkat: item.tingkat || 'Sekolah', keterangan: item.keterangan || '', tahun: Number(item.tahun) || new Date().getFullYear() });
                }
                for (const item of curr.filter((x: any) => !isNewId(x.id))) {
                    await updatePrestasiService(item.id, { bidang: item.bidang || 'Lainnya', nama_prestasi: item.nama_prestasi || '', tingkat: item.tingkat || 'Sekolah', keterangan: item.keterangan || '', tahun: Number(item.tahun) || new Date().getFullYear() });
                }
                for (const item of old.filter((x: any) => !curr.find((y: any) => y.id === x.id))) {
                    await deletePrestasiService(item.id);
                }
            }
            
            if (partialData.beasiswa) {
                const old = siswa?.beasiswa || [];
                const curr = partialData.beasiswa;
                for (const item of curr.filter((x: any) => isNewId(x.id))) {
                    await addBeasiswaService(siswaId, { pemberi: item.pemberi || '', tahun_pelajaran: item.tahun_pelajaran || '', keterangan: item.keterangan || '' });
                }
                for (const item of curr.filter((x: any) => !isNewId(x.id))) {
                    await updateBeasiswaService(item.id, { pemberi: item.pemberi || '', tahun_pelajaran: item.tahun_pelajaran || '', keterangan: item.keterangan || '' });
                }
                for (const item of old.filter((x: any) => !curr.find((y: any) => y.id === x.id))) {
                    await deleteBeasiswaService(item.id);
                }
            }

            // --- 5.5 PKL & EKSTRAKURIKULER (From TabLainnya) ---
            if ((partialData as any).pkl || (partialData as any).ekstrakurikuler) {
                const newPkls = (partialData as any).pkl || [];
                const newEkskuls = (partialData as any).ekstrakurikuler || [];
                
                const oldPkls: any[] = [];
                const oldEkskuls: any[] = [];
                siswa?.catatan_semester?.forEach(cas => {
                    oldPkls.push(...(cas.pkl || []));
                    oldEkskuls.push(...(cas.ekstrakurikuler || []));
                });

                const ensureCasId = async (kelas: string, semester: number) => {
                    let cas = siswa?.catatan_semester?.find(c => c.kelas === kelas && c.semester === Number(semester));
                    if (cas && cas.id) return cas.id;
                    const createdCas = await createCatatanSemesterService(siswaId, {
                        kelas,
                        semester: Number(semester),
                        catatan_wali_kelas: ''
                    });
                    return createdCas.id;
                };

                if ((partialData as any).pkl) {
                    for (const item of newPkls.filter((x: any) => isNewId(x.id))) {
                        const casId = await ensureCasId(item.kelas || 'XI', item.semester || 3);
                        await addPKLService(casId, {
                            nama_dudi: item.nama_dudi || '',
                            lokasi: item.lokasi || '',
                            lama_bulan: Number(item.lama_bulan) || 0,
                            keterangan: item.keterangan || ''
                        });
                    }
                    for (const item of newPkls.filter((x: any) => !isNewId(x.id))) {
                        await updatePKLService(item.id, {
                            nama_dudi: item.nama_dudi || '',
                            lokasi: item.lokasi || '',
                            lama_bulan: Number(item.lama_bulan) || 0,
                            keterangan: item.keterangan || ''
                        });
                    }
                    for (const item of oldPkls.filter((x: any) => !newPkls.find((y: any) => y.id === x.id))) {
                        await deletePKLService(item.id);
                    }
                }

                if ((partialData as any).ekstrakurikuler) {
                    for (const item of newEkskuls.filter((x: any) => isNewId(x.id))) {
                        const casId = await ensureCasId(item.kelas || 'X', item.semester || 1);
                        await addEkstrakurikulerService(casId, {
                            nama_kegiatan: item.nama_ekskul || item.nama_kegiatan || '',
                            keterangan: item.deskripsi || item.keterangan || ''
                        });
                    }
                    for (const item of newEkskuls.filter((x: any) => !isNewId(x.id))) {
                        await updateEkstrakurikulerService(item.id, {
                            nama_kegiatan: item.nama_ekskul || item.nama_kegiatan || '',
                            keterangan: item.deskripsi || item.keterangan || ''
                        });
                    }
                    for (const item of oldEkskuls.filter((x: any) => !newEkskuls.find((y: any) => y.id === x.id))) {
                        await deleteEkstrakurikulerService(item.id);
                    }
                }
            }

            // --- 6. CATATAN AKHIR SEMESTER ---
            if (partialData.catatan_semester) {
                const newCas = partialData.catatan_semester;

                // Create new CAS entries
                for (const cas of newCas.filter((x: any) => isNewId(x.id))) {
                    const semToKelas = semesterToKelas(cas.semester || 1);
                    const createdCas = await createCatatanSemesterService(siswaId, {
                        kelas: cas.kelas || semToKelas,
                        semester: cas.semester || 1,
                        catatan_wali_kelas: cas.catatan_wali_kelas || '',
                    });
                    const casId = createdCas?.id;
                    if (casId) {
                        for (const p of (cas.pkl || [])) {
                            await addPKLService(casId, { nama_dudi: p.nama_dudi || '', lokasi: p.lokasi || '', lama_bulan: Number(p.lama_bulan) || 0, keterangan: p.keterangan || '' });
                        }
                        for (const e of (cas.ekstrakurikuler || [])) {
                            await addEkstrakurikulerService(casId, { nama_kegiatan: e.nama_ekskul || '', keterangan: e.deskripsi || '' });
                        }
                    }
                }

                // Update existing CAS entries (this was the bug - they were silently skipped before)
                for (const cas of newCas.filter((x: any) => !isNewId(x.id))) {
                    await updateCatatanSemesterService(cas.id, {
                        catatan_wali_kelas: cas.catatan_wali_kelas || '',
                    });
                }

                // Note: no delete endpoint for CAS yet
            }

            // --- 7. MENINGGALKAN SEKOLAH ---
            if (partialData.meninggalkan_sekolah !== undefined) {
                const data = partialData.meninggalkan_sekolah;
                if (data === null) {
                    await deleteMeninggalkanSekolahService(siswaId);
                } else if (data) {
                    await addMeninggalkanSekolahService(siswaId, {
                        tipe: data.tipe || 'tamat',
                        tanggal_keluar: toDateStr(data.tanggal_keluar),
                        sekolah_tujuan: data.sekolah_tujuan || data.tujuan || '',
                        alamat_sekolah_tujuan: data.alamat_sekolah_tujuan || '',
                        alasan: data.alasan || '',
                        no_ijazah: data.no_ijazah || ''
                    });
                }
            }

            // --- SWEETALERT SUCCESS ---
            await queryClient.invalidateQueries({ queryKey: ['siswa', currentSiswaId] });
            setDataVersion(v => v + 1);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: isNew ? 'Data siswa berhasil ditambahkan!' : 'Data siswa berhasil diperbarui!',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                timerProgressBar: true,
            });

            if (isNew) {
                navigate('/siswa');
            }

        } catch (error: any) {
            console.error('Save error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: error.response?.data?.message || error.message || 'Terjadi kesalahan pada server',
                confirmButtonColor: '#d33',
            });
        }
    };

    // Horizontal scroll handler for tab bar
    const handleTabWheel = (e: React.WheelEvent) => {
        if (tabsRef.current) {
            e.preventDefault();
            tabsRef.current.scrollLeft += e.deltaY;
        }
    };

    if (isLoading) return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar title="Detail Siswa" />
                <div style={{ padding: '32px' }}>Loading...</div>
            </div>
        </div>
    );

    if (!isNew && !siswa) return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar title="Detail Siswa" />
                <div style={{ padding: '32px', color: '#fb7185' }}>Siswa tidak ditemukan.</div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div className="no-print" style={{ display: 'contents' }}>
                <Sidebar />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <div className="no-print">
                    <Navbar title={isNew ? "Tambah Data Siswa Baru" : `Detail Siswa: ${siswa?.nama}`} />
                </div>
                
                <div className="fade-in no-print" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    {/* STICKY TAB NAVIGATION */}
                    <div 
                        className="no-print" 
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderBottom: '1px solid var(--border)', 
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        {/* Top row: back button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px 0' }}>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigate('/siswa')} 
                            >
                                ← Kembali ke Daftar
                            </Button>
                        </div>

                        {/* Tab scroll row */}
                        <div 
                            ref={tabsRef}
                            className="tab-scroll-row"
                            onWheel={handleTabWheel}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '2px',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                padding: '8px 24px 0',
                                scrollBehavior: 'smooth',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none'
                            }}
                        >
                            {tabs.map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        borderRadius: '8px 8px 0 0',
                                        padding: '10px 18px',
                                        fontSize: '0.85rem',
                                        fontWeight: activeTab === tab.id ? 600 : 400,
                                        borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                                        boxShadow: 'none',
                                        transition: 'all 0.2s ease',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TAB CONTENT */}
                    <div style={{ padding: '24px' }}>
                        <div className="glass-panel" style={{ padding: '32px' }}>
                            {activeTab === 'pribadi' && <TabIdentitas key={`pribadi-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'alamat' && <TabIdentitas key={`alamat-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} section="alamat" />}
                            {activeTab === 'kesehatan' && <TabKesehatan key={`kesehatan-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'pendidikan' && <TabPendidikan key={`pendidikan-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'ayah' && <TabIdentitas key={`ayah-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} section="ayah" />}
                            {activeTab === 'ibu' && <TabIdentitas key={`ibu-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} section="ibu" />}
                            {activeTab === 'wali' && <TabIdentitas key={`wali-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} section="wali" />}
                            {activeTab === 'perkembangan' && <TabPerkembangan key={`perkembangan-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'lainnya' && <TabLainnya key={`lainnya-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'keluar' && <TabMeninggalkanSekolah key={`keluar-${dataVersion}`} siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                        </div>
                    </div>
                </div>

                {/* Print Layout */}
                <div className="print-only" style={{ padding: '40px', background: 'white', color: 'black' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid black', paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Buku Induk Siswa</h1>
                        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'normal' }}>Lembar Catatan Kelengkapan Data Siswa</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <section style={{ pageBreakInside: 'avoid' }}>
                            <TabIdentitas siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>
                        
                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>II. Akademik & Evaluasi</h2>
                            <TabAkademik siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>III. Kesehatan</h2>
                            <TabKesehatan siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>IV. Catatan Akhir Semester</h2>
                            <TabCatatan siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>V. Kepribadian</h2>
                            <TabKepribadian siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>VI. Prestasi & Beasiswa</h2>
                            <TabLainnya siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>VII. Pemeriksaan Buku Induk</h2>
                            <TabPemeriksaanBuku siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>

                        <div style={{ pageBreakBefore: 'always' }} />
                        <section>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}>VIII. Meninggalkan Sekolah</h2>
                            <TabMeninggalkanSekolah siswa={siswa} isNew={isNew} onSave={() => {}} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiswaDetail;

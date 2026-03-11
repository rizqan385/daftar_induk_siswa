import type { Siswa } from "../types/siswa.types";

const generateDefaultNested = (id: number) => ({
    // Tab Identitas
    alamat_siswa: { id, jalan: "Jl. Merdeka No. 1", kelurahan: "Sukabumi", kecamatan: "Mayangan", kota: "Probolinggo", provinsi: "Jawa Timur", kode_pos: "67219", tinggal_dengan: "Orang Tua", jarak_ke_sekolah: 2.5, transportasi: "Sepeda" },
    orang_tua: { id, tipe: "ayah" as const, nama: "Ayah Default", pekerjaan: "Swasta", penghasilan_bulanan: 5000000, jalan: "Jl. Merdeka No. 1", kelurahan: "Sukabumi", kecamatan: "Mayangan", kota: "Probolinggo", provinsi: "Jawa Timur", kode_pos: "67219" },
    wali: { id, nama_wali: "Budi Santoso", hubungan: "Paman", pekerjaan_wali: "Pegawai Swasta", no_telp_wali: "08123456789", penghasilan_bulanan: 4000000 },
    
    // Tab Kesehatan
    kesehatan_siswa: { id, tinggi_badan: 165, berat_badan: 55, golongan_darah: "O", kesanggupan_jasmani: "Baik" },
    riwayat_penyakit: [],
    
    // Tab Akademik
    pendidikan_sebelumnya: [{ id: 1, nama_sekolah: "SMPN 1 Probolinggo", tipe: "siswa_baru" as const, tanggal_diterima: "2020-07-01", kelas_diterima: "X" as const }],
    nilai_ijazah: { id, nomor_ijazah: "IJZ-2020-001", nilai_rata_rata: 85 },
    nilai_semester: [],
    nilai_sikap: [],
    kehadiran: [],
    
    // Tab Catatan Akhir Semester
    catatan_semester: [],

    // Tab Lainnya
    prestasi: [],
    beasiswa: [],
    kepribadian: [],
    pemeriksaan_buku: [],
    meninggalkan_sekolah: undefined
});

export const dummySiswa: Siswa[] = [
    {
        id: 1,
        no_induk: "1001",
        nisn: "0051234567",
        nama: "Rizqan",
        jenis_kelamin: "L",
        tanggal_lahir: "2005-04-12",
        agama: "Islam",
        anak_ke: 1,
        jumlah_saudara: 2,
        kewarganegaraan: "WNI",
        bahasa_rumah: "Indonesia",
        ...generateDefaultNested(1),
        orang_tua: { id: 1, tipe: "ayah", nama: "Faizal", pekerjaan: "PNS", penghasilan_bulanan: 6000000, jalan: "Jl. Sudirman", kelurahan: "Mangunharjo", kecamatan: "Mayangan", kota: "Probolinggo", provinsi: "Jawa Timur", kode_pos: "67219" },
        wali: { id: 1, nama_wali: "Faizal", hubungan: "Ayah", pekerjaan_wali: "PNS", no_telp_wali: "08991122334" },
        prestasi: [
            { id: 1, nama_prestasi: "Juara 1 Coding Nasional", bidang: "Olahraga", tingkat: "Nasional", tahun: "2024" },
            { id: 2, nama_prestasi: "Juara 2 Web Design", bidang: "Kesenian", tingkat: "Provinsi", tahun: "2023" },
        ],
    },
    {
        id: 2,
        no_induk: "1002",
        nisn: "0057654321",
        nama: "Dwi",
        jenis_kelamin: "L",
        tanggal_lahir: "2005-08-22",
        agama: "Kristen",
        anak_ke: 2,
        ...generateDefaultNested(2),
        wali: { id: 2, nama_wali: "Yanto", hubungan: "Ayah", pekerjaan_wali: "Wiraswasta", no_telp_wali: "0888776655" },
        prestasi: [
            { id: 3, nama_prestasi: "Juara 1 Lomba Pidato", tingkat: "Kabupaten", tahun: "2023" }
        ],
    },
    {
        id: 3,
        no_induk: "1003",
        nisn: "0061122334",
        nama: "Siti Nurhaliza",
        jenis_kelamin: "P",
        tanggal_lahir: "2006-01-05",
        agama: "Islam",
        ...generateDefaultNested(3),
        wali: { id: 3, nama_wali: "Slamet", hubungan: "Paman", pekerjaan_wali: "Petani", no_telp_wali: "0811223344" }
    }
];
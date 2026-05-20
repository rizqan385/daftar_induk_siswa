// -- TAB 1: IDENTITAS --
export interface OrangTua {
    id: number;
    tipe?: "ayah" | "ibu";
    nama: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    kewarganegaraan?: string;
    pendidikan_terakhir?: string;
    pekerjaan: string;
    penghasilan_bulanan?: number;
    alamat?: string; // from ERD TEXT
    no_telepon?: string;
    masih_hidup?: boolean;
    // UI split logic
    jalan?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    kode_pos?: string;
}

export interface AlamatSiswa {
    id: number;
    // Raw columns matching ERD Address block
    alamat_lengkap?: string;
    jalan: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
    no_telepon?: string;
    tinggal_dengan?: string;
    jarak_ke_sekolah?: number;
    transportasi?: string;
}

export interface Wali {
    id: number;
    nama_wali: string; // nama in ERD
    jenis_kelamin?: "L" | "P";
    tempat_lahir?: string;
    tanggal_lahir?: string;
    kewarganegaraan?: string;
    pendidikan_terakhir?: string;
    pekerjaan_wali: string; // pekerjaan in ERD
    penghasilan_bulanan?: number;
    alamat?: string;
    no_telp_wali: string; // no_telepon in ERD
    hubungan: string; // hubungan_dengan_siswa in ERD
}

export interface SiswaBase {
    id: number;
    no_induk: string;
    nisn: string;
    nama: string; // nama_lengkap
    nama_panggilan?: string;
    jenis_kelamin: "L" | "P";
    tempat_lahir?: string;
    tanggal_lahir: string; // YYYY-MM-DD
    agama?: string;
    anak_ke?: number;
    jumlah_saudara?: number;
    kewarganegaraan?: string;
    bahasa_rumah?: string;
    kelas_id?: number;
    kelas_ref?: { id: number; nama: string; tingkat?: string; };
    status?: string;
    foto_path?: string;
}

// -- TAB 2: AKADEMIK --
export interface PendidikanSebelumnya {
    id: number;
    tipe: "siswa_baru" | "pindahan";
    tanggal_diterima: string; // DATE YYYY-MM-DD
    nama_sekolah: string; // asal_sekolah in DB
    alamat_sekolah?: string;
    no_ijazah?: string;
    tanggal_ijazah?: string;
    no_skhun?: string;
    tanggal_skhun?: string;
    kelas_diterima: string;
    alasan_pindah?: string;
}

export interface MataPelajaran {
    id: number;
    kode?: string;
    nama_mapel: string; // nama
    kelompok_mapel: string; // kelompok (A,B,C)
    nama_sekolor?: string; // from user ERD typo (sub_kelompok)
    keterangan: string; // aktif status etc
}

export interface NilaiSemester {
    id: number;
    mata_pelajaran_id: number;
    mata_pelajaran?: MataPelajaran; 
    kelas?: "X" | "XI" | "XII";
    semester: number;
    tahun_pelajaran?: string;
    nilai_pengetahuan: number;
    predikat_pengetahuan?: "A" | "B" | "C" | "D";
    deskripsi_pengetahuan?: string;
    nilai_keterampilan?: number;
    predikat_keterampilan?: "A" | "B" | "C" | "D";
    deskripsi_keterampilan?: string;
}

export interface NilaiSikap {
    id: number;
    kelas: "X" | "XI" | "XII";
    semester: number;
    deskripsi_spiritual: string;
    deskripsi_sosial: string;
}

export interface NilaiIjazah {
    id: number;
    mata_pelajaran_id?: number;
    nomor_ijazah: string; // no_ijazah
    no_ijazah?: string;
    nilai_akhir?: number;
    nilai_rata_rata: number; // calculated from nilai_akhir
    tahun_lulus?: string;
    tanggal_lulus?: string;
}

export interface Kehadiran {
    id: number;
    kelas: "X" | "XI" | "XII";
    semester: number;
    jumlah_hadir: number;
    persentase_hadir?: number;
    jumlah_sakit: number;
    jumlah_izin: number;
    jumlah_alpa: number;
    jumlah_hari_efektif?: number;
}

// -- TAB 3: KESEHATAN --
export interface KesehatanSiswa {
    id: number;
    berat_badan: number; // berat_badan_masuk
    tinggi_badan: number; // tinggi_badan_masuk 
    berat_badan_keluar?: number;
    tinggi_badan_keluar?: number;
    golongan_darah: string;
    kesanggupan_jasmani?: string;
}

export interface RiwayatPenyakit {
    id: number;
    nama_penyakit: string; // jenis_penyakit
    tahun_sakit: string; // tahun
    lama_sakit?: string;
    keterangan?: string;
}

// -- TAB 4: CATATAN AKHIR SEMESTER --
export interface CatatanAkhirSemester {
    id: number;
    kelas?: "X" | "XI" | "XII";
    semester: number;
    catatan_wali_kelas: string; // inferred
    pkl: PKL[];
    ekstrakurikuler: Ekstrakurikuler[];
    prestasi_semester: PrestasiSemester[];
    ketidakhadiran_catatan?: KetidakhadiranCatatan;
}

export interface PKL {
    id: number;
    nama_dudi: string;
    lokasi: string;
    lama_bulan: number; // matched with API
    keterangan?: string;
}

export interface Ekstrakurikuler {
    id: number;
    nama_ekskul: string; // nama_kegiatan
    nilai: string; 
    deskripsi: string; // keterangan
}

export interface PrestasiSemester {
    id: number;
    nama_prestasi: string; // jenis_prestasi
    keterangan: string;
}

export interface KetidakhadiranCatatan {
    id: number;
    karena_sakit: number;
    dengan_izin: number;
    tanpa_keterangan: number;
}

// -- TAB 5: LAINNYA --
export interface Prestasi {
    id: number;
    nama_prestasi: string; // Let user map this to bidang/keterangan
    bidang?: "Kesenian" | "Olahraga" | "Kemasyarakatan";
    tingkat: string;
    tahun: string; // INT
    keterangan?: string;
}

export interface Beasiswa {
    id: number;
    tahun_pelajaran: string; // tahun_pelajaran in DB
    pemberi: string; // pemberi in DB
    keterangan?: string;
}

export interface Kepribadian {
    id: number;
    aspek: string;
    nilai: string;
    tahun_pelajaran: string;
}


export interface PemeriksaanBuku {
    id: number;
    no_urut?: number;
    tanggal_periksa: string; // tanggal
    nama_pemeriksa?: string;
    jabatan?: string;
    catatan_petugas: string; // keterangan
}

export interface MeninggalkanSekolah {
    id: number;
    tipe?: "tamat" | "pindah" | "putus";
    tanggal_keluar: string; // tanggal
    sekolah_tujuan?: string; // tujuan
    alamat_sekolah_tujuan?: string;
    no_ijazah?: string;
    alasan: string;
    tujuan: string; // derived
}

// -- THE ROOT SISWA ENTITY --
export interface Siswa extends SiswaBase {
    // 1-to-1 relationships
    alamat_siswa: AlamatSiswa;
    orang_tua: OrangTua; 
    orang_tua_ibu?: OrangTua;
    wali: Wali;
    kesehatan_siswa: KesehatanSiswa;
    nilai_ijazah?: NilaiIjazah;
    meninggalkan_sekolah?: MeninggalkanSekolah;
    
    // 1-to-Many relationships
    pendidikan_sebelumnya: PendidikanSebelumnya[];
    nilai_semester: NilaiSemester[];
    nilai_sikap: NilaiSikap[];
    kehadiran: Kehadiran[];
    riwayat_penyakit: RiwayatPenyakit[]; 
    catatan_semester: CatatanAkhirSemester[];
    prestasi: Prestasi[];
    beasiswa: Beasiswa[];
    kepribadian: Kepribadian[];
    pemeriksaan_buku: PemeriksaanBuku[];
}

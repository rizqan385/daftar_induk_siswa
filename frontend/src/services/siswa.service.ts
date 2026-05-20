import api from './api';

// API response wrapper type
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface PaginatedApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination: {
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
    };
}

// ---- Types matching backend response ----

export interface SiswaListItem {
    id: number;
    no_induk: string;
    nisn: string;
    nama: string;
    jenis_kelamin: string;
    kelas_id?: number;
    foto_path: string;
    status: string;
    created_at: string;
}

export interface SiswaDetail {
    id: number;
    no_induk: string;
    nisn: string;
    nama: string;
    nama_panggilan: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    anak_ke: number;
    jumlah_saudara: number;
    kewarganegaraan: string;
    bahasa_rumah: string;
    kelas_id?: number;
    foto_path: string;
    status: string;
    created_at: string;
    updated_at: string;
    alamat?: any;
    orang_tua?: any[];
    wali?: any;
    kesehatan?: any;
    pendidikan_sebelumnya?: any[];
    kepribadian?: any[];
    prestasi?: any[];
    beasiswa?: any[];
    kehadiran?: any[];
    nilai_semester?: any[];
    nilai_sikap?: any[];
    catatan_semester?: any[];
    nilai_ijazah?: any;
    meninggalkan_sekolah?: any;
}

// ---- API Calls ----

export const getAllSiswa = async (page = 1, pageSize = 50, search = ''): Promise<{data: SiswaListItem[], pagination: any}> => {
    const params: any = { page, page_size: pageSize };
    if (search) params.search = search;

    const response = await api.get<PaginatedApiResponse<SiswaListItem[]>>('/siswa', { params });
    return {
        data: response.data.data || [],
        pagination: response.data.pagination
    };
};

export const getSiswaById = async (id: number): Promise<SiswaDetail> => {
    const response = await api.get<ApiResponse<SiswaDetail>>(`/siswa/${id}`);
    return response.data.data;
};

export const createSiswa = async (data: any): Promise<SiswaDetail> => {
    const response = await api.post<ApiResponse<SiswaDetail>>('/siswa', data);
    return response.data.data;
};

export const updateSiswa = async (id: number, data: any): Promise<SiswaDetail> => {
    const response = await api.put<ApiResponse<SiswaDetail>>(`/siswa/${id}`, data);
    return response.data.data;
};

export const deleteSiswa = async (id: number): Promise<void> => {
    await api.delete(`/siswa/${id}`);
};

export const uploadFoto = async (id: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('foto', file);

    const response = await api.post<ApiResponse<{ foto_path: string }>>(`/siswa/${id}/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.foto_path;
};

// ---- Sub-resource API calls ----

export const createOrUpdateAlamat = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/alamat`, data);
    return response.data.data;
};

export const addOrangTua = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/orang-tua`, data);
    return response.data.data;
};

export const updateOrangTua = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/orang-tua/${id}`, data);
    return response.data.data;
};

export const deleteOrangTua = async (id: number): Promise<void> => {
    await api.delete(`/orang-tua/${id}`);
};

export const createOrUpdateWali = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/wali`, data);
    return response.data.data;
};

export const createOrUpdateKesehatan = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/kesehatan`, data);
    return response.data.data;
};

export const addRiwayatPenyakit = async (kesehatanId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/kesehatan/${kesehatanId}/riwayat-penyakit`, data);
    return response.data.data;
};

export const deleteRiwayatPenyakit = async (id: number): Promise<void> => {
    await api.delete(`/riwayat-penyakit/${id}`);
};

export const addPendidikan = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/pendidikan`, data);
    return response.data.data;
};

export const updatePendidikan = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/pendidikan/${id}`, data);
    return response.data.data;
};

export const deletePendidikan = async (id: number): Promise<void> => {
    await api.delete(`/pendidikan/${id}`);
};

export const addKepribadian = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/kepribadian`, data);
    return response.data.data;
};

export const deleteKepribadian = async (id: number): Promise<void> => {
    await api.delete(`/kepribadian/${id}`);
};

export const updateKepribadian = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/kepribadian/${id}`, data);
    return response.data.data;
};


export const addPrestasi = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/prestasi`, data);
    return response.data.data;
};

export const deletePrestasi = async (id: number): Promise<void> => {
    await api.delete(`/prestasi/${id}`);
};

export const updatePrestasi = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/prestasi/${id}`, data);
    return response.data.data;
};


export const addBeasiswa = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/beasiswa`, data);
    return response.data.data;
};

export const deleteBeasiswa = async (id: number): Promise<void> => {
    await api.delete(`/beasiswa/${id}`);
};

export const updateBeasiswa = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/beasiswa/${id}`, data);
    return response.data.data;
};


export const createNilaiSemester = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/nilai-semester`, data);
    return response.data.data;
};

export const batchCreateNilaiSemester = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/nilai-semester/batch`, data);
    return response.data.data;
};

export const updateNilaiSemester = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/nilai-semester/${id}`, data);
    return response.data.data;
};

export const deleteNilaiSemester = async (id: number): Promise<void> => {
    await api.delete(`/nilai-semester/${id}`);
};

export const getNilaiSemester = async (siswaId: number, params?: any): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/siswa/${siswaId}/nilai-semester`, { params });
    return response.data.data || [];
};

export const getKehadiran = async (siswaId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/siswa/${siswaId}/kehadiran`);
    return response.data.data || [];
};

export const createKehadiran = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/kehadiran`, data);
    return response.data.data;
};

export const createNilaiSikap = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/nilai-sikap`, data);
    return response.data.data;
};

export const createNilaiIjazah = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/nilai-ijazah`, data);
    return response.data.data;
};

export const getNilaiIjazah = async (siswaId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/siswa/${siswaId}/nilai-ijazah`);
    return response.data.data || [];
};

export const createCatatanSemester = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/catatan-semester`, data);
    return response.data.data;
};

export const updateCatatanSemester = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/catatan-semester/${id}`, data);
    return response.data.data;
};

export const getCatatanSemester = async (siswaId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/siswa/${siswaId}/catatan-semester`);
    return response.data.data || [];
};

export const addPKL = async (catatanId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/catatan-semester/${catatanId}/pkl`, data);
    return response.data.data;
};

export const updatePKL = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/pkl/${id}`, data);
    return response.data.data;
};

export const deletePKL = async (id: number): Promise<void> => {
    await api.delete(`/pkl/${id}`);
};

export const addEkstrakurikuler = async (catatanId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/catatan-semester/${catatanId}/ekstrakurikuler`, data);
    return response.data.data;
};

export const updateEkstrakurikuler = async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/ekstrakurikuler/${id}`, data);
    return response.data.data;
};

export const deleteEkstrakurikuler = async (id: number): Promise<void> => {
    await api.delete(`/ekstrakurikuler/${id}`);
};

export const addMeninggalkanSekolah = async (siswaId: number, data: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/siswa/${siswaId}/meninggalkan-sekolah`, data);
    return response.data.data;
};

export const deleteMeninggalkanSekolah = async (siswaId: number): Promise<void> => {
    await api.delete(`/siswa/${siswaId}/meninggalkan-sekolah`);
};

export const getMataPelajaran = async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/mata-pelajaran');
    return response.data.data || [];
};

// ---- Activity Log ----

export interface ActivityLogItem {
    id: number;
    user_id: number;
    username: string;
    action: string;
    entity_type: string;
    entity_id: number;
    description: string;
    ip_address: string;
    created_at: string;
}

export const getActivityLogs = async (page = 1, pageSize = 20): Promise<{data: ActivityLogItem[], pagination: any}> => {
    const response = await api.get<PaginatedApiResponse<ActivityLogItem[]>>('/activity-logs', {
        params: { page, page_size: pageSize }
    });
    return {
        data: response.data.data || [],
        pagination: response.data.pagination
    };
};
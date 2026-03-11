import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSiswa, getSiswaById, createSiswa, updateSiswa, deleteSiswa } from "../services/siswa.service";

export const useSiswa = (page = 1, pageSize = 50, search = '') => {
    return useQuery({
        queryKey: ["siswa", page, pageSize, search],
        queryFn: () => getAllSiswa(page, pageSize, search),
    });
};

export const useSiswaById = (id: number | undefined) => {
    return useQuery({
        queryKey: ["siswa", id],
        queryFn: () => getSiswaById(id!),
        enabled: !!id && id > 0,
    });
};

export const useAddSiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
        },
    });
};

export const useUpdateSiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            updateSiswa(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
        },
    });
};

export const useDeleteSiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
        },
    });
};
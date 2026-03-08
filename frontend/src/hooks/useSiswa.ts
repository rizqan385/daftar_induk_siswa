import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSiswa, addSiswa, updateSiswa, deleteSiswa } from "../services/siswa.service";
import type { Siswa } from "../types/siswa.types";

export const useSiswa = () => {
    return useQuery({
        queryKey: ["siswa"],
        queryFn: getAllSiswa,
    });
};

export const useAddSiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addSiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
        },
    });
};

export const useUpdateSiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Siswa> }) =>
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
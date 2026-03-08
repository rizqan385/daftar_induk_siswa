import { dummySiswa } from "../data/dummySiswa";
import type { Siswa } from "../types/siswa.types";

// Local mutable state for dummy CRUD operations
let currentSiswa: Siswa[] = [...dummySiswa];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllSiswa = async (): Promise<Siswa[]> => {
    await delay(400);
    return [...currentSiswa];
};

export const addSiswa = async (newSiswa: Omit<Siswa, "id">): Promise<Siswa> => {
    await delay(400);
    const id = Math.max(0, ...currentSiswa.map(s => s.id)) + 1;
    const siswaData: Siswa = { ...newSiswa, id };
    currentSiswa = [...currentSiswa, siswaData];
    return siswaData;
};

export const updateSiswa = async (id: number, updatedSiswa: Partial<Siswa>): Promise<Siswa> => {
    await delay(400);
    const index = currentSiswa.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Siswa not found");
    
    currentSiswa[index] = { ...currentSiswa[index], ...updatedSiswa };
    // Trigger array reference change
    currentSiswa = [...currentSiswa];
    return currentSiswa[index];
};

export const deleteSiswa = async (id: number): Promise<void> => {
    await delay(400);
    currentSiswa = currentSiswa.filter(s => s.id !== id);
};
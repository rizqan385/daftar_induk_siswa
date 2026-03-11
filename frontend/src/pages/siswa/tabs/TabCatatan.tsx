import { useState, useEffect } from 'react';
import type { Siswa, CatatanAkhirSemester } from "../../../types/siswa.types";
import Button from "../../../components/ui/Button";

interface TabCatatanProps {
    siswa: Siswa | undefined;
    isNew: boolean;
    onSave: (data: Partial<Siswa>) => void;
}

const TabCatatan = ({ siswa, isNew, onSave }: TabCatatanProps) => {
    // 1-to-Many State
    const [casList, setCasList] = useState<CatatanAkhirSemester[]>(siswa?.catatan_semester || []);

    // Re-sync state from prop when siswa API data is refreshed
    useEffect(() => {
        setCasList(siswa?.catatan_semester || []);
    }, [siswa]);


    if (isNew) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Silakan simpan Data Identitas terlebih dahulu sebelum mengisi Catatan Akhir.
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ catatan_semester: casList });
    };

    const addCas = () => {
        setCasList([...casList, { 
            id: Date.now(), 
            semester: casList.length + 1, 
            catatan_wali_kelas: '', 
            pkl: [], 
            ekstrakurikuler: [], 
            prestasi_semester: [] 
        }]);
    };

    const updateCas = (id: number, field: string, value: any) => {
        setCasList(casList.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCas = (id: number) => {
        setCasList(casList.filter(c => c.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Form Section: Catatan Akhir Semester */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Catatan Akhir Semester (CAS)</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addCas}>+ Tambah Semester</Button>
                </div>
                
                {casList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada catatan akhir semester.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {casList.map((cas) => (
                            <div key={cas.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>Semester {cas.semester}</h4>
                                    <Button type="button" variant="danger" size="sm" onClick={() => removeCas(cas.id)}>Hapus Semester</Button>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Catatan Wali Kelas</label>
                                    <textarea 
                                        value={cas.catatan_wali_kelas}
                                        rows={3}
                                        onChange={(e) => updateCas(cas.id, 'catatan_wali_kelas', e.target.value)}
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Placeholder for Nested Collections in UI */}
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <div style={{ flex: 1, padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px', border: '1px dashed rgba(59, 130, 246, 0.3)' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <strong>{cas.pkl.length} Data PKL</strong> <br/>
                                            <span style={{ fontSize: '0.75rem' }}>(UI form untuk list PKL bersarang di CAS ini)</span>
                                        </p>
                                    </div>
                                    <div style={{ flex: 1, padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <strong>{cas.ekstrakurikuler.length} Data Ekstrakurikuler</strong> <br/>
                                            <span style={{ fontSize: '0.75rem' }}>(UI form untuk list Ekstrakurikuler bersarang di CAS ini)</span>
                                        </p>
                                    </div>
                                    <div style={{ flex: 1, padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <strong>{cas.prestasi_semester.length} Data Prestasi Semester</strong> <br/>
                                            <span style={{ fontSize: '0.75rem' }}>(UI form untuk list Prestasi bersarang di CAS ini)</span>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <Button type="submit" size="lg">
                    💾 Simpan Catatan Akhir
                </Button>
            </div>
            
        </form>
    );
};

export default TabCatatan;

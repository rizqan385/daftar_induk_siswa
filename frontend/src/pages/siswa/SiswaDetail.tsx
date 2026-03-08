import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSiswa, useAddSiswa, useUpdateSiswa } from "../../hooks/useSiswa";
import TabIdentitas from "./tabs/TabIdentitas";
import TabAkademik from "./tabs/TabAkademik";
import TabKesehatan from "./tabs/TabKesehatan";
import TabCatatan from "./tabs/TabCatatan";
import TabLainnya from "./tabs/TabLainnya";
import TabKepribadian from "./tabs/TabKepribadian";
import TabPemeriksaanBuku from "./tabs/TabPemeriksaanBuku";
import TabMeninggalkanSekolah from "./tabs/TabMeninggalkanSekolah";
import type { Siswa } from "../../types/siswa.types";
import Button from "../../components/ui/Button";

const tabs = [
    { id: 'identitas', label: '👤 Identitas' },
    { id: 'akademik', label: '📚 Akademik' },
    { id: 'kesehatan', label: '🏥 Kesehatan' },
    { id: 'catatan', label: '📋 Catatan Akhir' },
    { id: 'kepribadian', label: '🧠 Kepribadian' },
    { id: 'lainnya', label: '🏆 Prestasi & Beasiswa' },
    { id: 'buku', label: '📖 Pemeriksaan Buku' },
    { id: 'pindah', label: '🏫 Pindah Sekolah' }
];

const SiswaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new';
    const tabsRef = useRef<HTMLDivElement>(null);
    
    // Hooks
    const { data: siswaList, isLoading } = useSiswa();
    const addSiswa = useAddSiswa();
    const updateSiswa = useUpdateSiswa();

    const siswa = siswaList?.find(s => s.id === Number(id));

    const [activeTab, setActiveTab] = useState('identitas');

    const handleSaveSiswaInfo = (partialData: Partial<Siswa>) => {
        if (isNew) {
            const newPayload = {
                ...partialData,
                pendidikan_sebelumnya: [],
                nilai_semester: [],
                nilai_sikap: [],
                kehadiran: [],
                riwayat_penyakit: [],
                catatan_akhir_semester: [],
                prestasi: [],
                beasiswa: [],
                kepribadian: [],
                pemeriksaan_buku: []
            } as any;
            
            addSiswa.mutate(newPayload, {
                onSuccess: () => navigate('/siswa')
            });
        } else if (siswa) {
            updateSiswa.mutate({ id: siswa.id, data: partialData }, {
                onSuccess: () => alert('Data berhasil disimpan!')
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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
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
                            position: 'sticky', 
                            top: 0, 
                            zIndex: 20, 
                            background: 'var(--bg-color)',
                            borderBottom: '1px solid var(--border-color)', 
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        {/* Top row: back button + print */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px 0' }}>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigate('/siswa')} 
                            >
                                ← Kembali ke Daftar
                            </Button>
                            {!isNew && (
                                <Button 
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => window.print()}
                                >
                                    🖨️ Cetak Laporan
                                </Button>
                            )}
                        </div>

                        {/* Tab scroll row */}
                        <div 
                            ref={tabsRef}
                            className="tab-scroll-row"
                            onWheel={handleTabWheel}
                            style={{
                                display: 'flex',
                                gap: '2px',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                padding: '8px 24px 0',
                                scrollBehavior: 'smooth',
                                msOverflowStyle: 'none',  /* Hide scrollbar IE/Edge */
                                scrollbarWidth: 'none'     /* Hide scrollbar Firefox */
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
                                        borderBottom: activeTab === tab.id ? '2px solid var(--accent-color)' : '2px solid transparent',
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
                            {activeTab === 'identitas' && <TabIdentitas siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'akademik' && <TabAkademik siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'kesehatan' && <TabKesehatan siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'catatan' && <TabCatatan siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'kepribadian' && <TabKepribadian siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'lainnya' && <TabLainnya siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'buku' && <TabPemeriksaanBuku siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
                            {activeTab === 'pindah' && <TabMeninggalkanSekolah siswa={siswa} isNew={isNew} onSave={handleSaveSiswaInfo} />}
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



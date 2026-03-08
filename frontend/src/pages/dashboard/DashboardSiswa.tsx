import { useSiswa } from "../../hooks/useSiswa"
import Sidebar from "../../components/layout/Sidebar"
import Navbar from "../../components/layout/Navbar"

const DashboardSiswa = () => {
    const { data, isLoading } = useSiswa()

    if (isLoading) return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar title="Dashboard Overview" />
                <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Loading Dashboard Data...</div>
                </div>
            </div>
        </div>
    );

    const totalSiswa = data?.length || 0
    const totalLaki = data?.filter((s) => s.jenis_kelamin === "L").length || 0
    const totalPerempuan = data?.filter((s) => s.jenis_kelamin === "P").length || 0
    const totalPrestasi = data?.reduce((acc, siswa) => acc + siswa.prestasi.length, 0) || 0

    const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
        <div 
            className="glass-panel" 
            style={{ 
                flex: "1 1 200px",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }}
        >
            {/* Decorative background circle */}
            <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: color,
                opacity: 0.1,
                zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ fontSize: "2rem", filter: "grayscale(20%)" }}>{icon}</div>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
            </div>
            <h4 style={{ position: "relative", zIndex: 1, color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>{title}</h4>
        </div>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar title="Dashboard Overview" />

                <div className="fade-in" style={{ padding: "32px", maxWidth: "1200px", width: "100%" }}>
                    
                    <div style={{ marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "1.8rem", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
                            Overview Statistik
                        </h2>
                        <p style={{ color: "var(--text-secondary)" }}>Ringkasan data siswa saat ini.</p>
                    </div>

                    <div style={{ 
                        display: "flex", 
                        gap: "24px", 
                        flexWrap: "wrap",
                        marginBottom: "40px"
                    }}>
                        <StatCard title="Total Siswa" value={totalSiswa} icon="👥" color="#3b82f6" />
                        <StatCard title="Laki-laki" value={totalLaki} icon="👦" color="#10b981" />
                        <StatCard title="Perempuan" value={totalPerempuan} icon="👧" color="#f43f5e" />
                        <StatCard title="Total Prestasi" value={totalPrestasi} icon="🏆" color="#f59e0b" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardSiswa

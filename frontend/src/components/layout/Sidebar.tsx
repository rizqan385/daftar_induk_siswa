import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface MenuItem {
    label: string;
    icon: string;
    path?: string;
    children?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    {
        label: "Data Utama", icon: "📋",
        children: [
            { label: "Data Siswa", path: "/siswa" },
            { label: "Data Kelas", path: "/data-kelas" },
        ]
    },
    {
        label: "Kesiswaan", icon: "🎓",
        children: [
            { label: "Prestasi Siswa", path: "/prestasi" },
            { label: "Beasiswa", path: "/beasiswa" },
            { label: "Ekstrakurikuler", path: "/ekstrakurikuler" },
            { label: "PKL", path: "/pkl" },
        ]
    },
    {
        label: "Akademik", icon: "📚",
        children: [
            { label: "Mata Pelajaran", path: "/mata-pelajaran" },
            { label: "Input Nilai", path: "/input-nilai" },
            { label: "Input Nilai Ekskul", path: "/input-nilai-ekskul" },
            { label: "Input Ketidakhadiran", path: "/input-ketidakhadiran" },
        ]
    },
    { label: "Kenaikan Kelas", icon: "📈", path: "/kenaikan-kelas" },
    { label: "Log Aktivitas", icon: "📝", path: "/log-aktivitas" },
];

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    }, [isCollapsed]);

    // Auto-open the parent dropdown that contains the current route
    useEffect(() => {
        menuItems.forEach(item => {
            if (item.children) {
                const isChildActive = item.children.some(child => location.pathname.startsWith(child.path));
                if (isChildActive && !openMenus.includes(item.label)) {
                    setOpenMenus(prev => [...prev, item.label]);
                }
            }
        });
    }, [location.pathname]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

    const sidebarWidth = isCollapsed ? "72px" : "260px";

    return (
        <aside style={{
            position: "relative",
            width: sidebarWidth,
            minWidth: sidebarWidth,
            transition: "width 0.3s ease, min-width 0.3s ease",
            zIndex: 50,
            height: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Collapse toggle (rendered outside the scrollable container) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: "absolute",
                    right: "-14px",
                    top: "32px",
                    background: "#3b82f6",
                    color: "white",
                    border: "2px solid #0f1b2d",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    padding: 0,
                    zIndex: 60,
                    fontSize: "1rem",
                    lineHeight: 1
                }}
                title="Toggle Sidebar"
            >
                {isCollapsed ? "›" : "‹"}
            </button>

            {/* Inner scrollable container */}
            <div style={{
                flex: 1,
                background: "linear-gradient(180deg, #0f1b2d 0%, #1a2744 100%)",
                color: "#e2e8f0",
                padding: isCollapsed ? "16px 8px" : "16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                transition: "padding 0.3s ease",
                overflowX: "hidden",
                overflowY: "auto",
                boxShadow: "2px 0 12px rgba(0,0,0,0.3)"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 8px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: "8px",
                    justifyContent: isCollapsed ? "center" : "flex-start"
                }}>
                    <span style={{ fontSize: "1.6rem" }}>📘</span>
                    {!isCollapsed && (
                        <span style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.5px"
                        }}>
                            BUKU INDUK
                        </span>
                    )}
                </div>

                {/* Menu Items */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                    {menuItems.map((item) => {
                        if (item.path) {
                            // Simple nav link
                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        gap: "10px",
                                        padding: isCollapsed ? "10px 0" : "10px 12px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        color: isActive ? "#fff" : "#94a3b8",
                                        background: isActive ? "rgba(59, 130, 246, 0.25)" : "transparent",
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: "0.88rem",
                                        transition: "all 0.15s ease",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden"
                                    })}
                                    title={item.label}
                                >
                                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                                    {!isCollapsed && <span>{item.label}</span>}
                                </NavLink>
                            );
                        }

                        // Dropdown menu
                        const isOpen = openMenus.includes(item.label);
                        const isChildActive = item.children?.some(child => location.pathname.startsWith(child.path));
                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isCollapsed ? "center" : "space-between",
                                        gap: "10px",
                                        padding: isCollapsed ? "10px 0" : "10px 12px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: isChildActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                                        color: isChildActive ? "#fff" : "#94a3b8",
                                        fontWeight: isChildActive ? 600 : 400,
                                        fontSize: "0.88rem",
                                        cursor: "pointer",
                                        width: "100%",
                                        textAlign: "left",
                                        transition: "all 0.15s ease",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden"
                                    }}
                                    title={item.label}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: isCollapsed ? "none" : 1, overflow: "hidden" }}>
                                        <span style={{ fontSize: "1.1rem", flexShrink: 0, display: "flex" }}>{item.icon}</span>
                                        {!isCollapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        <span style={{
                                            fontSize: "0.7rem",
                                            transition: "transform 0.2s",
                                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            flexShrink: 0,
                                            marginLeft: "4px"
                                        }}>▼</span>
                                    )}
                                </button>

                                {/* Dropdown children */}
                                {isOpen && !isCollapsed && (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1px",
                                        paddingLeft: "20px",
                                        marginTop: "2px",
                                        borderLeft: "2px solid rgba(59, 130, 246, 0.3)",
                                        marginLeft: "20px"
                                    }}>
                                        {item.children?.map(child => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                style={({ isActive }) => ({
                                                    display: "block",
                                                    padding: "8px 12px",
                                                    borderRadius: "6px",
                                                    textDecoration: "none",
                                                    color: isActive ? "#60a5fa" : "#94a3b8",
                                                    background: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                                                    fontWeight: isActive ? 600 : 400,
                                                    fontSize: "0.83rem",
                                                    transition: "all 0.15s ease"
                                                })}
                                            >
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;

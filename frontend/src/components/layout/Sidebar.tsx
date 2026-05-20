import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface MenuItem {
    label: string;
    path?: string;
    section?: string;
    children?: { label: string; path: string }[];
    icon: React.ReactNode;
}

// Clean, minimal SVG icons — no emojis
const Icon = {
    dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    school:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    book:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    trending:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    printer:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    clipboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
};

const menuItems: MenuItem[] = [
    { label: "Dashboard",      icon: Icon.dashboard, path: "/dashboard" },
    { label: "Data Utama",     icon: Icon.users, section: "DATA MASTER", children: [
        { label: "Data Siswa", path: "/siswa" },
        { label: "Data Kelas", path: "/data-kelas" },
    ]},
    { label: "Kesiswaan",      icon: Icon.school, children: [
        { label: "Prestasi Siswa",  path: "/prestasi" },
        { label: "Beasiswa",        path: "/beasiswa" },
        { label: "Ekstrakurikuler", path: "/ekstrakurikuler" },
        { label: "PKL",             path: "/pkl" },
    ]},
    { label: "Akademik",       icon: Icon.book, section: "AKADEMIK", children: [
        { label: "Mata Pelajaran",      path: "/mata-pelajaran" },
        { label: "Input Nilai",         path: "/input-nilai" },
        { label: "Input Nilai Ekskul",  path: "/input-nilai-ekskul" },
        { label: "Ketidakhadiran",      path: "/input-ketidakhadiran" },
    ]},
    { label: "Kenaikan Kelas", icon: Icon.trending, path: "/kenaikan-kelas" },
    { label: "Cetak Laporan",   icon: Icon.printer, section: "LAPORAN", path: "/cetak" },
    { label: "Log Aktivitas",  icon: Icon.clipboard, section: "ADMIN", path: "/log-aktivitas" },
];

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() =>
        localStorage.getItem("sidebarCollapsed") === "true"
    );
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", String(isCollapsed));
    }, [isCollapsed]);

    // Auto-open parent when a child route is active
    useEffect(() => {
        menuItems.forEach(item => {
            if (item.children) {
                const hasActive = item.children.some(c => location.pathname.startsWith(c.path));
                if (hasActive) setOpenMenus(prev => prev.includes(item.label) ? prev : [...prev, item.label]);
            }
        });
    }, [location.pathname]);

    const toggleMenu = (label: string) =>
        setOpenMenus(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

    const w = isCollapsed ? 64 : 230;

    return (
        <aside style={{
            width: w,
            minWidth: w,
            maxWidth: w,
            height: "100vh",
            position: "sticky",
            top: 0,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #4a3278 0%, #2e1f50 100%)",
            transition: "width 0.25s ease, min-width 0.25s ease, max-width 0.25s ease",
            zIndex: 100,
            overflow: "hidden",
            flexShrink: 0,
        }}>
            {/* Header / Logo */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: isCollapsed ? "18px 0" : "18px 16px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                minHeight: 62,
                flexShrink: 0,
            }}>
                <div style={{
                    width: 32, height: 32,
                    background: "white",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    padding: 3,
                }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                {!isCollapsed && (
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "white", whiteSpace: "nowrap", lineHeight: 1.2 }}>BUKU INDUK</div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>Sistem Data Siswa</div>
                    </div>
                )}
            </div>

            {/* Nav items */}
            <nav style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "8px 6px",
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}>
                {menuItems.map((item, idx) => {
                    const showSection = !isCollapsed && item.section &&
                        (idx === 0 || menuItems[idx - 1]?.section !== item.section);
                    const isOpen = openMenus.includes(item.label);
                    const isChildActive = item.children?.some(c => location.pathname.startsWith(c.path));

                    return (
                        <div key={item.label}>
                            {showSection && (
                                <div style={{
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.8px",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.3)",
                                    padding: "10px 8px 3px",
                                    whiteSpace: "nowrap",
                                }}>
                                    {item.section}
                                </div>
                            )}

                            {item.path ? (
                                <NavLink
                                    to={item.path}
                                    title={isCollapsed ? item.label : undefined}
                                    style={({ isActive }) => ({
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 9,
                                        padding: isCollapsed ? "9px 0" : "9px 10px",
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        borderRadius: 7,
                                        textDecoration: "none",
                                        color: isActive ? "white" : "rgba(255,255,255,0.58)",
                                        background: isActive ? "rgba(255,255,255,0.13)" : "transparent",
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: "0.83rem",
                                        transition: "all 0.15s",
                                        whiteSpace: "nowrap",
                                    })}
                                >
                                    <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>
                                    {!isCollapsed && <span>{item.label}</span>}
                                </NavLink>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        title={isCollapsed ? item.label : undefined}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 9,
                                            padding: isCollapsed ? "9px 0" : "9px 10px",
                                            justifyContent: isCollapsed ? "center" : "flex-start",
                                            borderRadius: 7,
                                            border: "none",
                                            background: isChildActive ? "rgba(255,255,255,0.1)" : "transparent",
                                            color: isChildActive ? "white" : "rgba(255,255,255,0.58)",
                                            fontWeight: isChildActive ? 600 : 400,
                                            fontSize: "0.83rem",
                                            cursor: "pointer",
                                            width: "100%",
                                            textAlign: "left",
                                            transition: "all 0.15s",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>
                                        {!isCollapsed && (
                                            <>
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                                <span style={{
                                                    fontSize: "0.6rem",
                                                    opacity: 0.5,
                                                    transform: isOpen ? "rotate(180deg)" : "none",
                                                    transition: "transform 0.2s",
                                                    flexShrink: 0,
                                                }}>▼</span>
                                            </>
                                        )}
                                    </button>

                                    {isOpen && !isCollapsed && (
                                        <div style={{
                                            paddingLeft: 25,
                                            marginLeft: 18,
                                            borderLeft: "1px solid rgba(255,255,255,0.1)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            marginTop: 2,
                                        }}>
                                            {item.children?.map(child => (
                                                <NavLink
                                                    key={child.path}
                                                    to={child.path}
                                                    style={({ isActive }) => ({
                                                        display: "block",
                                                        padding: "7px 10px",
                                                        borderRadius: 6,
                                                        textDecoration: "none",
                                                        color: isActive ? "white" : "rgba(255,255,255,0.5)",
                                                        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                                        fontWeight: isActive ? 600 : 400,
                                                        fontSize: "0.8rem",
                                                        transition: "all 0.15s",
                                                        whiteSpace: "nowrap",
                                                    })}
                                                >
                                                    {child.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse toggle button at the bottom */}
            <div style={{
                padding: "10px 6px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                flexShrink: 0,
            }}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "none",
                        borderRadius: 7,
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: isCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s", flexShrink: 0 }}>
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    {!isCollapsed && <span>Sembunyikan</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

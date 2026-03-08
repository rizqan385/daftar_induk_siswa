import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    // Persist sidebar state
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    }, [isCollapsed]);

    const sidebarWidth = isCollapsed ? "80px" : "260px";

    return (
        <div
            style={{
                width: sidebarWidth,
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                padding: isCollapsed ? "24px 12px" : "24px",
                paddingTop: "32px",
                minHeight: "100vh",
                borderRight: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                transition: "width 0.3s ease, padding 0.3s ease",
                position: "relative",
                zIndex: 50
            }}
        >
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: "absolute",
                    right: "-14px",
                    top: "36px",
                    background: "var(--accent-gradient)",
                    color: "white",
                    border: "2px solid var(--bg-surface)",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-md)",
                    padding: 0,
                    zIndex: 10,
                    fontSize: "1.2rem",
                    lineHeight: 1
                }}
                title="Toggle Sidebar"
            >
                {isCollapsed ? "›" : "‹"}
            </button>

            <h2 style={{ 
                fontSize: isCollapsed ? "1rem" : "1.5rem", 
                fontWeight: 700, 
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "16px",
                textAlign: isCollapsed ? "center" : "left",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                overflow: "hidden"
            }}>
                {isCollapsed ? "SIM" : "SIM Siswa"}
            </h2>
            
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>
                    <NavLink
                        to="/dashboard"
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            gap: "12px",
                            padding: isCollapsed ? "12px 0" : "12px 16px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                            fontWeight: isActive ? 600 : 500,
                            borderLeft: isActive ? "3px solid var(--accent-color)" : "3px solid transparent",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                            overflow: "hidden"
                        })}
                        title="Dashboard"
                    >
                        <span style={{ fontSize: "1.2rem" }}>📊</span>
                        {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/siswa"
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            gap: "12px",
                            padding: isCollapsed ? "12px 0" : "12px 16px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                            fontWeight: isActive ? 600 : 500,
                            borderLeft: isActive ? "3px solid var(--accent-color)" : "3px solid transparent",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                            overflow: "hidden"
                        })}
                        title="Data Siswa"
                    >
                        <span style={{ fontSize: "1.2rem" }}>👥</span>
                        {!isCollapsed && <span>Data Siswa</span>}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

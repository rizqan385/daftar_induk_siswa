import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth.service";

interface NavbarProps {
    title?: string;
}

const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
    const { user } = useAuth();

    return (
        <div style={{
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "16px 32px",
            color: "var(--text-primary)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10
        }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>{title}</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                        width: "36px", 
                        height: "36px", 
                        borderRadius: "50%", 
                        background: "var(--accent-gradient)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                    }}>
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{user?.username || 'Admin'}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Administrator</div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "rgba(244, 63, 94, 0.1)",
                        color: "#fb7185",
                        border: "1px solid rgba(244, 63, 94, 0.2)",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
                    }}
                >
                    🚪 Keluar
                </button>
            </div>
        </div>
    );
};

export default Navbar;
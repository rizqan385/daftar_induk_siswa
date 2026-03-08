interface NavbarProps {
    title?: string;
}

const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
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
                    A
                </div>
                <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Admin User</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Administrator</div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
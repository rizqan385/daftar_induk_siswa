import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth.service";

interface NavbarProps {
    title?: string;
}

const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
    const { user } = useAuth();

    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="topbar-title">{title}</div>
            </div>

            <div className="topbar-right">


                <div className="topbar-user">
                    <div className="topbar-avatar">
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="topbar-user-info">
                        <div className="username">{user?.username || 'Admin'}</div>
                        <div className="role">Administrator</div>
                    </div>
                </div>

                <button className="topbar-logout" onClick={logout}>
                    Keluar
                </button>
            </div>
        </div>
    );
};

export default Navbar;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await loginApi({ username, password });
            setAuth(response.user, response.token);
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login gagal. Periksa username dan password.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-color)',
            padding: '20px'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'fixed',
                top: '-200px',
                right: '-200px',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-200px',
                left: '-200px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div className="fade-in" style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Logo / Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '2rem',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                    }}>
                        📚
                    </div>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        background: 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        SIM Siswa
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Sistem Informasi Manajemen Data Induk Siswa
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-panel" style={{ padding: '36px' }}>
                    <h2 style={{
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        marginBottom: '24px',
                        color: 'var(--text-primary)',
                        textAlign: 'center'
                    }}>
                        Masuk ke Sistem
                    </h2>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#fb7185',
                            fontSize: '0.9rem',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Username
                            </label>
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                required
                                autoFocus
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    background: 'rgba(15, 23, 42, 0.4)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-color)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    background: 'rgba(15, 23, 42, 0.4)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-color)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                background: isLoading ? 'rgba(59, 130, 246, 0.4)' : 'var(--accent-gradient)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: isLoading ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.3)',
                                marginTop: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            {isLoading ? '🔄 Memproses...' : '🔐 Masuk'}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    marginTop: '24px',
                    opacity: 0.7
                }}>
                    © 2026 SIM Siswa — Sistem Informasi Data Induk
                </p>
            </div>
        </div>
    );
};

export default Login;

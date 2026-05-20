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
            setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #f0f2f8 0%, #e8e5f5 100%)',
        }}>
            {/* Left purple panel */}
            <div style={{
                width: '42%',
                background: 'linear-gradient(160deg, #5c3d8f 0%, #3d2465 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'rgba(255,255,255,1)',
                        borderRadius: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        padding: '8px'
                    }}>
                        <img src="/logo.png" alt="Logo SMK YAJ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px', lineHeight: 1.2 }}>
                        BUKU INDUK SISWA
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '280px' }}>
                        Sistem Informasi Manajemen Data Induk Siswa SMK
                    </p>

                    <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {['Data Siswa Lengkap', 'Nilai & Akademik', 'Log Aktivitas', 'Export & Cetak'].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>✓</div>
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right login form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px'
            }}>
                <div className="fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '36px' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Selamat Datang 👋
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Masuk ke sistem dengan akun administrator
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'var(--danger-bg)',
                            border: '1px solid #fecaca',
                            color: 'var(--danger-text)',
                            fontSize: '0.875rem',
                            marginBottom: '20px',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                                USERNAME
                            </label>
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                required
                                autoFocus
                                className="form-input"
                                style={{ padding: '12px 14px', fontSize: '0.95rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                                PASSWORD
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                                className="form-input"
                                style={{ padding: '12px 14px', fontSize: '0.95rem' }}
                            />
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '13px',
                                borderRadius: '10px',
                                background: isLoading ? '#9b8fd0' : 'linear-gradient(135deg, #6c4dab 0%, #9b72e6 100%)',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 14px rgba(108, 77, 171, 0.35)',
                                marginTop: '6px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isLoading ? '🔄 Memproses...' : '🔐 Masuk ke Sistem'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '28px' }}>
                        © 2026 SIM Siswa — Sistem Informasi Data Induk
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

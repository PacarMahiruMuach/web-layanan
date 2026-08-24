import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'rw' || data.user.role === 'superadmin') {
          navigate('/admin/dashboard', { state: { role: 'superadmin', user: data.user } });
        } else if (data.user.role === 'rt') {
          navigate('/admin/dashboard-rt', { state: { user: data.user } });
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError('Username atau password salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan pada server.');
    }
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('Memproses...');
    setResetToken('');
    
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername })
      });
      
      const data = await res.json();
      setForgotMessage(data.message);
      if (data.token) {
        setResetToken(data.token);
      }
    } catch (err) {
      setForgotMessage('Terjadi kesalahan saat memproses permintaan.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/20 rounded-pebble blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-container/20 rounded-pebble-2 blur-3xl -z-10"></div>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-10 shadow-ambient relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary-container/30 rounded-pebble flex items-center justify-center text-primary mb-6 shadow-sm">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Admin Portal</h1>
          <p className="text-base text-on-surface-variant">RW 003 Kampung Utan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide text-on-surface-variant ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base text-on-surface placeholder:text-outline-variant"
                placeholder="Masukkan Username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide text-on-surface-variant ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base text-on-surface placeholder:text-outline-variant"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface" />
              <span className="text-sm text-on-surface-variant">Ingat saya</span>
            </label>
            <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-on-primary text-base font-semibold tracking-wide py-4 rounded-full hover:shadow-[0_12px_24px_rgba(74,101,73,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight size={20} />
          </button>

          <div className="pt-4 text-center border-t border-outline-variant/30 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </button>
          </div>
        </form>
      </div>

      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold text-on-surface mb-2">Reset Password</h3>
            <p className="text-on-surface-variant mb-6 text-sm">Masukkan username Anda untuk mendapatkan link reset password.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                  <input 
                    type="text" 
                    required
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary font-semibold py-4 rounded-full hover:shadow-lg transition-all"
              >
                Kirim Permintaan
              </button>
            </form>
            
            {forgotMessage && (
              <div className="mt-4 p-4 bg-primary-container text-on-primary-container rounded-xl text-sm text-center">
                <p>{forgotMessage}</p>
                {resetToken && (
                  <div className="mt-3">
                    <p className="font-semibold text-xs mb-1">Simulasi Email (Untuk Testing):</p>
                    <button 
                      onClick={() => navigate(`/admin/reset-password?token=${resetToken}`)}
                      className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm hover:opacity-90 w-full"
                    >
                      Buka Link Reset Password
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotMessage('');
                setResetToken('');
                setForgotUsername('');
              }}
              className="w-full mt-4 bg-surface-container-high text-on-surface font-semibold py-3.5 rounded-full hover:bg-surface-container-highest transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

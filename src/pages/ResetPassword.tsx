import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token reset password tidak valid atau tidak ditemukan.');
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Gagal mereset password');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Ornaments (consistent with AdminLogin) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-10 relative z-10 border border-outline-variant/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-container/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary rotate-3">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Reset Password</h1>
          <p className="text-on-surface-variant font-medium">Masukkan password baru Anda</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="bg-primary-container text-on-primary-container p-4 rounded-xl mb-6 font-medium">
              {message}
            </div>
            <button 
              onClick={() => navigate('/admin/login')}
              className="w-full bg-primary text-on-primary font-semibold py-4 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Kembali ke Login
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {status === 'error' && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-medium">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface ml-1">Password Baru</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={!token || status === 'loading'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-on-surface"
                  placeholder="Masukkan password baru"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface ml-1">Konfirmasi Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  disabled={!token || status === 'loading'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-on-surface"
                  placeholder="Konfirmasi password baru"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={!token || status === 'loading'}
                className="w-full bg-primary text-on-primary font-semibold py-4 rounded-full hover:shadow-[0_8px_20px_rgba(55,102,103,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <button 
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                Kembali ke halaman Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

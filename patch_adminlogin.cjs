const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');

// Insert states
const stateInjection = `  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetToken, setResetToken] = useState('');`;

code = code.replace("  const [error, setError] = useState('');", stateInjection);

// Update Forgot Password link
const forgotLink = `<a href="#" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
              Forgot Password?
            </a>`;
const newForgotLink = `<button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
              Forgot Password?
            </button>`;
code = code.replace(forgotLink, newForgotLink);

// Handler for forgot password
const forgotHandler = `
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
`;

code = code.replace("  return (", forgotHandler + "\n  return (");

// Modal UI at the end
const modalUI = `
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
                      onClick={() => navigate(\`/admin/reset-password?token=\${resetToken}\`)}
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
}`;

code = code.replace("    </div>\n  );\n}", modalUI);

fs.writeFileSync('src/pages/AdminLogin.tsx', code);
console.log('AdminLogin patched');

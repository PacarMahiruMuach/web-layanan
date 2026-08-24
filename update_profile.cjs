const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

// Update state
code = code.replace(
  /const \[profileFormData, setProfileFormData\] = useState\(\{\s*name: user\?\.name \|\| `Ketua RT \$\{rtNumber\}`,\s*email: user\?\.email \|\| `rt\$\{rtNumber\}@rw003\.com`,\s*password: ''\s*\}\);/,
  `const [profileFormData, setProfileFormData] = useState({ 
    name: user?.name || \`Ketua RT \${rtNumber}\`, 
    username: user?.username || \`rt\${rtNumber}\`, 
    oldPassword: '',
    newPassword: ''
  });`
);

// Update HTML Form
const oldForm = `            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Email</label>
                <input 
                  type="email" 
                  value={profileFormData.email}
                  onChange={(e) => setProfileFormData({...profileFormData, email: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Password Baru (Opsional)</label>
                <input 
                  type="password" 
                  value={profileFormData.password}
                  onChange={(e) => setProfileFormData({...profileFormData, password: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="Kosongkan jika tidak ingin diubah"
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-4 bg-tertiary text-on-tertiary font-semibold py-4 rounded-full hover:shadow-[0_8px_20px_rgba(55,102,103,0.2)] hover:-translate-y-0.5 transition-all"
              >
                Simpan Perubahan
              </button>
            </form>`;

const newForm = `            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Username</label>
                <input 
                  type="text" 
                  value={profileFormData.username}
                  onChange={(e) => setProfileFormData({...profileFormData, username: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Role</label>
                <input 
                  type="text" 
                  value={\`Ketua RT \${rtNumber}\`}
                  disabled
                  readOnly
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-on-surface-variant cursor-not-allowed"
                />
              </div>
              
              <hr className="border-outline-variant/30 my-6" />
              <div className="mb-2">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Ubah Password (Opsional)</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Password Lama</label>
                <input 
                  type="password" 
                  value={profileFormData.oldPassword}
                  onChange={(e) => setProfileFormData({...profileFormData, oldPassword: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="Masukkan password saat ini"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Password Baru</label>
                <input 
                  type="password" 
                  value={profileFormData.newPassword}
                  onChange={(e) => setProfileFormData({...profileFormData, newPassword: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="Masukkan password baru"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full mt-4 bg-tertiary text-on-tertiary font-semibold py-4 rounded-full hover:shadow-[0_8px_20px_rgba(55,102,103,0.2)] hover:-translate-y-0.5 transition-all"
              >
                Simpan Perubahan
              </button>
            </form>`;

code = code.replace(oldForm, newForm);

fs.writeFileSync('src/pages/DashboardRT.tsx', code);
console.log('Profile form updated');

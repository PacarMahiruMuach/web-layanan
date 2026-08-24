const fs = require('fs');

function replaceFile(path, replacements) {
    let code = fs.readFileSync(path, 'utf8');
    for (let r of replacements) {
        code = code.replace(r.old, r.new);
    }
    fs.writeFileSync(path, code);
}

// 1. AdminLogin.tsx
replaceFile('src/pages/AdminLogin.tsx', [
    { old: 'Forgot Password?', new: 'Lupa Password?' },
    { old: 'Remember me', new: 'Ingat saya' }
]);

// 2. ResidentDirectory.tsx
replaceFile('src/pages/ResidentDirectory.tsx', [
    { old: 'placeholder="Search by name..."', new: 'placeholder="Cari berdasarkan nama..."' },
    { old: 'title="Edit"', new: 'title="Edit"' },
    { old: 'title="Delete"', new: 'title="Hapus"' }
]);

// 3. Home.tsx
replaceFile('src/pages/Home.tsx', [
    { old: 'Welcome to our community', new: 'Selamat datang di lingkungan kami' }
]);

// 4. AdminDashboard.tsx
replaceFile('src/pages/AdminDashboard.tsx', [
    { old: '<Settings size={20} />\\n              Settings', new: '<Settings size={20} />\\n              Pengaturan' }
]);

console.log('Language fixed');

const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
    /<Settings size=\{20\} \/>\s*Settings/g,
    '<Settings size={20} />\n              Pengaturan'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('AdminDashboard fixed');

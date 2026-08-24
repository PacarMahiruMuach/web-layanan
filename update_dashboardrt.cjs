const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

// 2. Samakan Menu 'Data Warga' -> update href="#" to Link
code = code.replace(
  /<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">\s*<Users size={20} \/>\s*Data Warga\s*<\/a>/g,
  `<Link to="/admin/dashboard-rt/directory" className={\`\${location.pathname === '/admin/dashboard-rt/directory' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}>
              <Users size={20} />
              Data Warga
            </Link>`
);

// 3. Hapus Menu 'Laporan Masuk'
code = code.replace(
  /<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">\s*<AlertTriangle size={20} \/>\s*Laporan Masuk\s*<\/a>/g,
  ''
);

// 5. Hapus Menu 'Pengaturan'
code = code.replace(
  /<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200">\s*<Settings size={20} \/>\s*Pengaturan\s*<\/a>/g,
  ''
);

// Write back
fs.writeFileSync('src/pages/DashboardRT.tsx', code);
console.log('Sidebar links updated');

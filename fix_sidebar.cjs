const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

const dataWarga = `<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">
              <Users size={20} />
              Data Warga
            </a>`;

const dataWargaLink = `<Link to="/admin/dashboard-rt/directory" className={\`\${location.pathname === '/admin/dashboard-rt/directory' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}>
              <Users size={20} />
              Data Warga
            </Link>`;

code = code.replace(dataWarga, dataWargaLink);

const laporanMasuk = `<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">
              <AlertTriangle size={20} />
              Laporan Masuk
            </a>`;
code = code.replace(laporanMasuk, "");

const pengaturan = `<a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200">
              <Settings size={20} />
              Pengaturan
            </a>`;
code = code.replace(pengaturan, "");

fs.writeFileSync('src/pages/DashboardRT.tsx', code);
console.log('Sidebar fixed');

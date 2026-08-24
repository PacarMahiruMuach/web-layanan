const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const navStart = code.indexOf('<Link \n              to="/admin/dashboard/finances"');
const newLinks = `<Link 
              to="/admin/dashboard/news" 
              className={\`\${location.pathname === '/admin/dashboard/news' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}
            >
              <Newspaper size={20} />
              Berita
            </Link>
            <Link 
              to="/admin/dashboard/activities" 
              className={\`\${location.pathname === '/admin/dashboard/activities' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}
            >
              <Calendar size={20} />
              Aktivitas
            </Link>
            `;

code = code.substring(0, navStart) + newLinks + code.substring(navStart);

code = code.replace("import { Menu, Search, Bell, Settings, LogOut, LayoutDashboard, Users, Wallet, Building2, AlertTriangle, Plus, UserPlus, Activity, X } from 'lucide-react';", "import { Menu, Search, Bell, Settings, LogOut, LayoutDashboard, Users, Wallet, Building2, AlertTriangle, Plus, UserPlus, Activity, X, Newspaper, Calendar } from 'lucide-react';");

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('AdminDashboard patched');

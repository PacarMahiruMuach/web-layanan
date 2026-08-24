const fs = require('fs');

let rtCode = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

// Extract the main content and replace with <Outlet />
const mainStart = rtCode.indexOf('<main className="flex-1 h-full overflow-y-auto bg-background p-5 md:p-10 w-full">');
const mainEnd = rtCode.indexOf('</main>', mainStart) + 7;

const mainContent = rtCode.substring(mainStart, mainEnd);

const overviewContent = `import React, { useState, useEffect } from 'react';
import { RefreshCcw, Send, MoreVertical, Droplets, TreePine, VolumeX, Flame } from 'lucide-react';

interface Report {
  id: number;
  nama: string;
  no_rt: string;
  judul: string;
  deskripsi: string;
  status: string;
  kategori: string;
  timestamp: string;
  bukti?: string;
}

export default function DashboardRTOverview({ rtNumber, reports, fetchReports, changeStatus, escalateReport, getIconForCategory }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    ${mainContent.replace(/<main[^>]*>/, '<main className="flex-1 h-full overflow-y-auto bg-background w-full">')}
    
      {/* Modal Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img src={selectedImage} alt="Bukti Laporan (Zoom)" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            <button className="absolute -top-4 -right-4 w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center shadow-ambient hover:bg-error-container hover:text-error transition-colors" onClick={() => setSelectedImage(null)}>
              X
            </button>
          </div>
        </div>
      )}
  );
}
`;

fs.writeFileSync('src/pages/DashboardRTOverview.tsx', overviewContent);

// Replace main content with <Outlet context={{...}} />
const replaceWith = `<main className="flex-1 h-full overflow-y-auto bg-background p-5 md:p-10 w-full">
          <Outlet context={{ rtNumber, reports, fetchReports, changeStatus, escalateReport, getIconForCategory }} />
        </main>`;

rtCode = rtCode.substring(0, mainStart) + replaceWith + rtCode.substring(mainEnd);

// Add import Outlet
rtCode = rtCode.replace("import { useNavigate, useLocation } from 'react-router-dom';", "import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';");

// Update the navigation links in DashboardRT.tsx to have Berita and Aktivitas
const rtNavStart = rtCode.indexOf('<nav className="flex-1 overflow-y-auto px-4 space-y-2">');
const rtNavEnd = rtCode.indexOf('</nav>', rtNavStart);
const oldNav = rtCode.substring(rtNavStart, rtNavEnd);

const newNav = `<nav className="flex-1 overflow-y-auto px-4 space-y-2">
            <Link to="/admin/dashboard-rt" className={\`\${location.pathname === '/admin/dashboard-rt' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/admin/dashboard-rt/news" className={\`\${location.pathname === '/admin/dashboard-rt/news' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}>
              <Newspaper size={20} />
              Berita
            </Link>
            <Link to="/admin/dashboard-rt/activities" className={\`\${location.pathname === '/admin/dashboard-rt/activities' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 transition-all duration-200\`}>
              <Calendar size={20} />
              Aktivitas
            </Link>
            <a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">
              <Users size={20} />
              Data Warga
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3.5 hover:translate-x-1 transition-all duration-200">
              <AlertTriangle size={20} />
              Laporan Masuk
            </a>`;
            
rtCode = rtCode.replace(oldNav, newNav);

// Add Newspaper and Calendar to imports in DashboardRT.tsx
rtCode = rtCode.replace("import { Menu, Search, Bell, Settings, LogOut, LayoutDashboard, Users, AlertTriangle, Plus, X, UserCircle, RefreshCcw, Send, MoreVertical, Droplets, TreePine, VolumeX, Flame, Leaf } from 'lucide-react';", "import { Menu, Search, Bell, Settings, LogOut, LayoutDashboard, Users, AlertTriangle, Plus, X, UserCircle, RefreshCcw, Send, MoreVertical, Droplets, TreePine, VolumeX, Flame, Leaf, Newspaper, Calendar } from 'lucide-react';");


fs.writeFileSync('src/pages/DashboardRT.tsx', rtCode);
console.log('DashboardRT patched');

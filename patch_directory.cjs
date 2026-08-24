const fs = require('fs');
let code = fs.readFileSync('src/pages/ResidentDirectory.tsx', 'utf8');

if (!code.includes('import { useLocation }')) {
  code = code.replace(
    `import { Search, Plus, Edit, Trash2, X } from 'lucide-react';`,
    `import { Search, Plus, Edit, Trash2, X } from 'lucide-react';\nimport { useLocation } from 'react-router-dom';`
  );
}

if (!code.includes('const location = useLocation();')) {
  code = code.replace(
    `export default function ResidentDirectory() {`,
    `export default function ResidentDirectory() {\n  const location = useLocation();\n  const storedUserStr = localStorage.getItem('user');\n  const user = location.state?.user || (storedUserStr ? JSON.parse(storedUserStr) : null);\n  const isRtUser = user?.role === 'rt';\n  const rtNumber = user?.rt_number || user?.no_rt;`
  );
}

if (!code.includes('\`/api/residents?rt=\${rtNumber}\`')) {
  code = code.replace(
    `const res = await fetch('/api/residents');`,
    `const fetchUrl = isRtUser && rtNumber ? \`/api/residents?rt=\${rtNumber.replace(/[^0-9]/g, '')}\` : '/api/residents';\n      const res = await fetch(fetchUrl);`
  );
}

// Adjust RT filter in Add Modal
if (code.includes('no_rt: \'01\',')) {
    code = code.replace(
        `no_rt: '01',`,
        `no_rt: isRtUser && rtNumber ? rtNumber.replace(/[^0-9]/g, '').padStart(2, '0') : '01',`
    );
}

// Disable RT input if user is RT
const selectRegex = /<select\s+name="no_rt"\s+value=\{formData\.no_rt\}\s+onChange=\{handleChange\}\s+className="w-full bg-surface-container-low border border-outline-variant\/50 rounded-2xl px-5 py-3\.5 focus:outline-none focus:ring-2 focus:ring-primary\/50 transition-all text-on-surface appearance-none"\s+required\s*>/;

if (code.match(selectRegex) && !code.includes('disabled={isRtUser}')) {
    code = code.replace(selectRegex, `<select \n                    name="no_rt"\n                    value={formData.no_rt}\n                    onChange={handleChange}\n                    disabled={isRtUser}\n                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface appearance-none disabled:opacity-50 disabled:cursor-not-allowed"\n                    required\n                  >`);
}

fs.writeFileSync('src/pages/ResidentDirectory.tsx', code);
console.log('ResidentDirectory patched');

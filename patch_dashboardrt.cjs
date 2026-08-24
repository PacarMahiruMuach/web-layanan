const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

const oldLine = `const rtNumber = user?.no_rt || "01";`;
const newLine = `const rawRt = user?.rt_number || user?.no_rt || "01";\n  const rtNumber = rawRt.replace(/[^0-9]/g, '').padStart(2, '0');`;

code = code.replace(oldLine, newLine);
fs.writeFileSync('src/pages/DashboardRT.tsx', code);
console.log('Patched DashboardRT.tsx');

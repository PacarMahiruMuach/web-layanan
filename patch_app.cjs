const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = "import Activities from './pages/Activities';";
const newImport = importTarget + "\nimport Kalender from './pages/Kalender';";
code = code.replace(importTarget, newImport);

const routeTarget = '<Route path="/activities" element={<Activities />} />';
const newRoute = routeTarget + '\n              <Route path="/kalender" element={<Kalender />} />';
code = code.replace(routeTarget, newRoute);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched');

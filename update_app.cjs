const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const routeStr = `<Route path="directory" element={<ResidentDirectory />} />`;
if (!code.includes(routeStr + ' // RT')) {
  code = code.replace(
    `<Route path="/admin/dashboard-rt" element={<DashboardRT />}>`,
    `<Route path="/admin/dashboard-rt" element={<DashboardRT />}>\n          <Route path="directory" element={<ResidentDirectory />} />`
  );
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx updated');
}

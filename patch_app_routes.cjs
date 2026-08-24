const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import ResetPassword')) {
  code = code.replace(
    `import AdminLogin from './pages/AdminLogin';`,
    `import AdminLogin from './pages/AdminLogin';\nimport ResetPassword from './pages/ResetPassword';`
  );
}

if (!code.includes('<Route path="/admin/reset-password" element={<ResetPassword />} />')) {
  code = code.replace(
    `<Route path="/admin/login" element={<AdminLogin />} />`,
    `<Route path="/admin/login" element={<AdminLogin />} />\n        <Route path="/admin/reset-password" element={<ResetPassword />} />`
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log('App routes patched');

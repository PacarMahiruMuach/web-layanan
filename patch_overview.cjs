const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRTOverview.tsx', 'utf8');

code = code.replace("return (\n    <main", "return (\n    <>\n    <main");
code = code.replace("  );\n}", "  </>\n  );\n}");

fs.writeFileSync('src/pages/DashboardRTOverview.tsx', code);
console.log('DashboardRTOverview patched');

const fs = require('fs');
let serverCode = fs.readFileSync('server.ts', 'utf8');

const target = `const allReports = await db.select().from(reports).where(eq(reports.is_escalated_to_rw, true));
    const unresolvedReports = allReports.filter(r => r.status !== "Selesai").length;`;

const replacement = `const allReports = await db.select().from(reports);
    const unresolvedReports = allReports.filter(r => r.status.toLowerCase() !== "selesai").length;`;

serverCode = serverCode.replace(target, replacement);
fs.writeFileSync('server.ts', serverCode);
console.log("Patched server.ts for reports");

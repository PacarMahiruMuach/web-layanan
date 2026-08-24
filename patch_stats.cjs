const fs = require('fs');
let serverCode = fs.readFileSync('server.ts', 'utf8');

const target = `app.get("/api/stats", async (req, res) => {
  try {
    const allReports = await db.select().from(reports).where(eq(reports.is_escalated_to_rw, true));
    const unresolvedReports = allReports.filter(r => r.status !== "Selesai").length;
    
    res.json({
      totalResidents: 1248,
      monthlyIuran: 45200000,
      unresolvedReports
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});`;

const replacement = `app.get("/api/stats", async (req, res) => {
  try {
    const allReports = await db.select().from(reports).where(eq(reports.is_escalated_to_rw, true));
    const unresolvedReports = allReports.filter(r => r.status !== "Selesai").length;
    
    const allResidents = await db.select().from(residents);
    const totalResidents = allResidents.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const allTransactions = await db.select().from(transactions);
    const monthlyIuran = allTransactions.reduce((sum, t) => {
      const date = new Date(t.created_at);
      if (t.type === 'Pemasukan' && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return sum + t.amount;
      }
      return sum;
    }, 0);
    
    res.json({
      totalResidents,
      monthlyIuran,
      unresolvedReports
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});`;

serverCode = serverCode.replace(target, replacement);
fs.writeFileSync('server.ts', serverCode);
console.log("Patched server.ts");

// Memastikan koneksi database terbaca langsung
process.env.DATABASE_URL = "postgresql://postgres:faris123@localhost:5432/web_layanan";

import { db } from "./src/db/index.ts";
import { users } from "./src/db/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function testLogin() {
  try {
    console.log("Sedang mencari user 'admin' di database...");
    const result = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (result.length === 0) {
      console.log("❌ GAGAL: Username 'admin' tidak ditemukan sama sekali di database!");
    } else {
      const user = result[0];
      console.log("✅ Ditemukan user:", { id: user.id, username: user.username, role: user.role });
      console.log("Hash password di DB:", user.password);
      
      // Tes pencocokan password dengan 'admin123'
      const isMatch = await bcrypt.compare("admin123", user.password);
      if (isMatch) {
        console.log("🎉 BERHASIL: Password 'admin123' COCOK dengan hash di database!");
      } else {
        console.log("❌ GAGAL: Password 'admin123' TIDAK COCOK dengan hash di database!");
      }
    }
    process.exit(0);
  } catch (error) {
    console.error("Terjadi error koneksi/database:", error);
    process.exit(1);
  }
}

testLogin();
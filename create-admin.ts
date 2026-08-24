// Atur DATABASE_URL secara langsung di baris paling atas sebelum impor database
process.env.DATABASE_URL = "postgresql://postgres:faris123@localhost:5432/web_layanan";

import { db } from "./src/db/index.ts";
import { users } from "./src/db/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Cek apakah username 'admin' sudah ada
    const existing = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (existing.length > 0) {
      // Jika sudah ada, perbarui password dan rolenya
      await db.update(users)
        .set({ password: hashedPassword, role: "admin", rt_number: "00" })
        .where(eq(users.username, "admin"));
      console.log("-> Sukses: Password akun 'admin' berhasil diperbarui!");
    } else {
      // Jika belum ada, buat baru
      await db.insert(users).values({
        username: "admin",
        name: "Administrator RW",
        password: hashedPassword,
        role: "admin",
        rt_number: "00",
      });
      console.log("-> Sukses: Akun admin baru berhasil dibuat!");
    }
    process.exit(0);
  } catch (error) {
    console.error("Gagal membuat admin:", error);
    process.exit(1);
  }
}

createAdmin();
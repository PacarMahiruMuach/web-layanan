import { db } from "./src/db"; 
import { users } from "./src/db/schema";
import bcrypt from "bcryptjs"; // <-- Ubah bagian ini menjadi bcryptjs

async function createAdmin() {
  console.log("Membuat akun admin dengan password terenkripsi...");
  
  // Mengenkripsi password 'admin123'
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    username: "admin",
    name: "Super Administrator",
    password: hashedPassword, 
    role: "admin",
    rt_number: "000"
  });

  console.log("Berhasil! Silakan coba login di web.");
  process.exit(0);
}

createAdmin();
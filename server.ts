import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const app = express();
const PORT = 8080;

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 
    'video/mp4', 'video/quicktime', 'video/webm',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Format file tidak didukung (${file.mimetype}). Hanya gambar, video, dan dokumen (PDF/Word) yang diperbolehkan.`), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

import { eq, and, or, desc } from "drizzle-orm";
import { db } from "./src/db/index.ts";
import { users, reports, residents, posts, transactions, assets, system_logs } from "./src/db/schema.ts";

// Helper function to log system actions
export async function logSystemAction(action: string, description: string) {
  try {
    await db.insert(system_logs).values({ action, description });
  } catch (error) {
    console.error("Failed to log system action:", error);
  }
}

// Middleware Logging Otomatis (System Logs)
app.use(async (req, res, next) => {
  const allowedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  
  if (allowedMethods.includes(req.method)) {
    try {
      // 1. Keamanan: Fungsi untuk menyensor payload
      const sanitizePayload = (body: any) => {
        if (!body || typeof body !== 'object') return body;
        const sanitized = { ...body };
        const sensitiveKeys = ['password', 'pin', 'token'];
        
        for (const key of Object.keys(sanitized)) {
          if (sensitiveKeys.includes(key.toLowerCase())) {
            sanitized[key] = '***';
          }
        }
        return sanitized;
      };

      // 2. Penerjemah Endpoint (Mapper)
      let actionStr = 'Aktivitas Sistem';
      let baseDescription = 'Melakukan perubahan data di dalam sistem';

      if (req.path.includes('/api/login') && req.method === 'POST') {
        actionStr = 'Login Sistem';
        baseDescription = 'Pengguna berhasil masuk ke portal';
      } else if ((req.path.includes('/api/assets') || req.path.includes('/api/infrastructure')) && ['PUT', 'PATCH'].includes(req.method)) {
        actionStr = 'Update Infrastruktur';
        baseDescription = 'Memperbarui data atau status infrastruktur';
      } else if (req.path.includes('/api/users/rt') && req.method === 'POST') {
        actionStr = 'Tambah Akun RT';
        baseDescription = 'Membuat akun ketua RT baru';
      }

      // 3. Format Deskripsi yang Rapi
      const sanitizedBody = sanitizePayload(req.body);
      let detailString = '';
      
      if (sanitizedBody && Object.keys(sanitizedBody).length > 0) {
        // Mengubah key-value menjadi string yang mudah dibaca
        const changes = Object.entries(sanitizedBody)
          .map(([k, v]) => `${k} diubah menjadi ${v}`)
          .join(', ');
        detailString = `. Detail perubahan: ${changes}`;
      } else {
        detailString = '.';
      }

      const finalDescription = baseDescription + detailString;

      // Eksekusi insert ke database
      await db.insert(system_logs).values({
        action: actionStr,
        description: finalDescription,
      });
    } catch (error) {
      console.error("Gagal mencatat system log otomatis:", error);
    }
  }
  
  next(); // Lanjutkan ke endpoint tujuan
});

// Endpoints
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.select().from(users).where(eq(users.username, username));
    
    if (result.length > 0) {
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        res.json({ message: "Login successful", user: user });
      } else {
        res.status(401).json({ error: "Username atau password salah" });
      }
    } else {
      res.status(401).json({ error: "Username atau password salah" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Database error occurred", details: error });
  }
});
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    const result = await db.select().from(users).where(eq(users.username, username));
    
    if (result.length > 0) {
      const user = result[0];
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
      
      await db.update(users)
        .set({ reset_token: resetToken, reset_token_expires: resetExpires })
        .where(eq(users.id, user.id));
        
      // In a real application, send this token via email
      console.log(`Reset token for ${username}: ${resetToken}`);
      
      res.json({ message: "Jika username terdaftar, instruksi reset password telah dibuat.", token: resetToken }); // Sending token for demo purposes
    } else {
      // Don't reveal if user exists or not for security
      res.json({ message: "Jika username terdaftar, instruksi reset password telah dibuat." });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token dan password baru diperlukan" });
    }
    
    const result = await db.select().from(users).where(eq(users.reset_token, token));
    
    if (result.length > 0) {
      const user = result[0];
      
      if (user.reset_token_expires && new Date(user.reset_token_expires) > new Date()) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.update(users)
          .set({ 
            password: hashedPassword, 
            reset_token: null, 
            reset_token_expires: null 
          })
          .where(eq(users.id, user.id));
          
        res.json({ message: "Password berhasil direset. Silakan login dengan password baru." });
      } else {
        res.status(400).json({ error: "Token reset password sudah kedaluwarsa atau tidak valid" });
      }
    } else {
      res.status(400).json({ error: "Token reset password tidak valid" });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mereset password" });
  }
});

app.get("/api/users/rt", async (req, res) => {
  try {
    const result = await db.select().from(users).where(eq(users.role, 'rt'));
    res.json(result);
  } catch (error) {
    console.error("Fetch RT users error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/users/rt", async (req, res) => {
  try {
    const { username, password, rt_number, name } = req.body;
    if (!username || !password || !rt_number || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await db.insert(users).values({
      username,
      password: hashedPassword,
      name,
      role: "rt",
      rt_number,
    }).returning();
    
    await logSystemAction('BUAT AKUN RT', `Akun RT baru dibuat dengan nama '${name}' (${rt_number}).`);
    
    res.status(201).json(newUser[0]);
  } catch (error: any) {
    if (String(error).includes('unique constraint') || (error.cause && String(error.cause).includes('unique constraint'))) {
      return res.status(400).json({ error: "Username sudah digunakan. Silakan pilih username lain." });
    }
    console.error("Create RT user error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    const deletedUser = await db.delete(users).where(eq(users.id, userId)).returning();
    
    if (deletedUser.length === 0) {
      return res.status(404).json({ error: "Data akun tidak ditemukan" });
    }
    
    await logSystemAction('HAPUS AKUN', `Akun RT dengan username '${deletedUser[0].username}' telah dihapus.`);
    
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada database saat menghapus" });
  }
});

app.put("/api/users/profile/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, username, password, oldPassword, newPassword } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    
    if (newPassword || password) {
      const pwdToHash = newPassword || password;
      
      // If we're using oldPassword, we should verify it
      if (oldPassword) {
        const existingUser = await db.select().from(users).where(eq(users.id, id));
        if (existingUser.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(oldPassword, existingUser[0].password);
        if (!isMatch) {
          return res.status(401).json({ error: "Password lama salah" });
        }
      }
      
      updateData.password = await bcrypt.hash(pwdToHash, 10);
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
      
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully", user: updatedUser[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/system-logs", async (req, res) => {
  try {
    const result = await db.select().from(system_logs).orderBy(desc(system_logs.created_at)).limit(20);
    res.json(result);
  } catch (error) {
    console.error("Fetch logs error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const allReports = await db.select().from(reports);
    const unresolvedReports = allReports.filter(r => r.status.toLowerCase() !== "selesai").length;
    
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
});

app.get("/api/posts", async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = db.select().from(posts).$dynamic();
    
    if (type) {
      query = query.where(eq(posts.type, type as string));
    } else if (category) {
      query = query.where(eq(posts.category, category as string));
    }
    
    const result = await query.orderBy(desc(posts.created_at));
    res.json(result);
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { title, content, category, author, type, eventDate, location } = req.body;
    let image = null;
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    if (!title || !content || !category || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    let eventDateParsed = null;
    if (eventDate) {
      // Treat the incoming datetime-local string as WIB (Jakarta time, UTC+7)
      eventDateParsed = new Date(`${eventDate}+07:00`);
    }
    
    const result = await db.insert(posts).values({
      title,
      content,
      category,
      type: type || 'news',
      event_date: eventDateParsed,
      location: location || null,
      image,
      author,
    }).returning();
    
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, category, eventDate, location } = req.body;
    let image = req.body.existingImage || null;
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    let eventDateParsed = null;
    if (eventDate) {
      eventDateParsed = new Date(`${eventDate}+07:00`);
    }
    
    const updateData: any = {
      title,
      content,
      category,
      location: location || null,
      image
    };
    if (eventDate) updateData.event_date = eventDateParsed;
    
    const result = await db.update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
      
    if (result.length === 0) return res.status(404).json({ error: "Post not found" });
    res.json(result[0]);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedPost = await db.delete(posts).where(eq(posts.id, id)).returning();
    if (deletedPost.length === 0) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const { rt, escalated } = req.query;
    console.log('Query RT:', req.query.rt);
    
    let query = db.select().from(reports).$dynamic();
    
    if (escalated === "true") {
      query = query.where(eq(reports.is_escalated_to_rw, true));
    } else if (rt) {
      const rtStr = rt as string;
      const rtPadded = rtStr.padStart(2, '0');
      const rtStripped = rtStr.replace(/^0+/, '');
      
      query = query.where(
        and(
          or(
            eq(reports.no_rt, rtStr),
            eq(reports.no_rt, rtPadded),
            eq(reports.no_rt, rtStripped)
          ),
          eq(reports.is_escalated_to_rw, false)
        )
      );
    }
    
    const result = await query.orderBy(desc(reports.created_at));
    // Map created_at to timestamp for backward compatibility with frontend
    const mappedResult = result.map(r => ({
      ...r,
      timestamp: r.created_at
    }));
    res.json(mappedResult);
  } catch (error) {
    console.error("Fetch reports error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/reports", upload.single("bukti"), async (req, res) => {
  try {
    const { nama, no_rt, no_wa, judul, deskripsi, alamat, urgensi, kategori } = req.body;
    const buktiPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!judul || !deskripsi) {
      return res.status(400).json({ error: "Missing required fields: judul, deskripsi" });
    }

    const newReport = await db.insert(reports).values({
      nama: nama || "Anonim",
      no_rt: no_rt || "-",
      no_wa: no_wa || "-",
      kategori: kategori || "Lain-lain",
      judul,
      deskripsi,
      alamat: alamat || "-",
      urgensi: urgensi || "Sedang",
      status: "Belum diproses",
      is_escalated_to_rw: false,
      bukti: buktiPath,
    }).returning();

    res.status(201).json(newReport[0]);
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/api/reports/:id/escalate", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const updatedReport = await db.update(reports)
      .set({ is_escalated_to_rw: true, status: "Diteruskan ke RW" })
      .where(eq(reports.id, id))
      .returning();
      
    if (updatedReport.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(updatedReport[0]);
  } catch (error) {
    console.error("Escalate report error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/api/reports/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const updatedReport = await db.update(reports)
      .set({ status })
      .where(eq(reports.id, id))
      .returning();
      
    if (updatedReport.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(updatedReport[0]);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/residents", async (req, res) => {
  try {
    const { rt } = req.query;
    
    let query = db.select().from(residents).$dynamic();
    
    if (rt) {
      const rtStr = rt as string;
      const rtPadded = rtStr.padStart(2, '0');
      const rtStripped = rtStr.replace(/^0+/, '');
      
      query = query.where(
        or(
          eq(residents.no_rt, rtStr),
          eq(residents.no_rt, rtPadded),
          eq(residents.no_rt, rtStripped)
        )
      );
    }
    
    const result = await query.orderBy(desc(residents.created_at));
    res.json(result);
  } catch (error) {
    console.error("Fetch residents error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/residents", async (req, res) => {
  try {
    const { nama_lengkap, no_rumah, no_rt, status_tinggal, no_telepon } = req.body;
    
    if (!nama_lengkap || !no_rumah || !no_rt || !status_tinggal) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newResident = await db.insert(residents).values({
      nama_lengkap,
      no_rumah,
      no_rt,
      status_tinggal,
      no_telepon: no_telepon || null,
    }).returning();
    
    res.status(201).json(newResident[0]);
  } catch (error) {
    console.error("Create resident error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/api/residents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama_lengkap, no_rumah, no_rt, status_tinggal, no_telepon } = req.body;
    
    const updateData: any = {};
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (no_rumah !== undefined) updateData.no_rumah = no_rumah;
    if (no_rt !== undefined) updateData.no_rt = no_rt;
    if (status_tinggal !== undefined) updateData.status_tinggal = status_tinggal;
    if (no_telepon !== undefined) updateData.no_telepon = no_telepon;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    const updatedResident = await db.update(residents)
      .set(updateData)
      .where(eq(residents.id, id))
      .returning();
      
    if (updatedResident.length === 0) {
      return res.status(404).json({ error: "Resident not found" });
    }
    
    res.json(updatedResident[0]);
  } catch (error) {
    console.error("Update resident error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/api/residents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const deletedResident = await db.delete(residents)
      .where(eq(residents.id, id))
      .returning();
      
    if (deletedResident.length === 0) {
      return res.status(404).json({ error: "Resident not found" });
    }
    
    res.json({ message: "Resident deleted successfully", resident: deletedResident[0] });
  } catch (error) {
    console.error("Delete resident error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const result = await db.select().from(transactions).orderBy(desc(transactions.created_at));
    res.json(result);
  } catch (error) {
    console.error("Fetch transactions error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/transactions", upload.single("receipt"), async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    let receipt = null;
    
    if (req.file) {
      receipt = `/uploads/${req.file.filename}`;
    }
    
    if (!type || !amount || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const result = await db.insert(transactions).values({
      type,
      amount: parseInt(amount, 10),
      description,
      receipt,
    }).returning();
    
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const deletedTransaction = await db.delete(transactions)
      .where(eq(transactions.id, id))
      .returning();
      
    if (deletedTransaction.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json({ message: "Transaction deleted successfully", transaction: deletedTransaction[0] });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/api/assets", async (req, res) => {
  try {
    const result = await db.select().from(assets).orderBy(desc(assets.created_at));
    res.json(result);
  } catch (error) {
    console.error("Fetch assets error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/api/assets", async (req, res) => {
  try {
    const { name, quantity, condition } = req.body;
    
    if (!name || quantity === undefined || !condition) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const result = await db.insert(assets).values({
      name,
      quantity: parseInt(quantity, 10),
      condition,
      is_borrowed: false,
      borrower_name: null,
    }).returning();
    
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Create asset error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/api/assets/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { condition, is_borrowed, borrower_name } = req.body;
    
    const updateData: any = {};
    if (condition !== undefined) updateData.condition = condition;
    if (is_borrowed !== undefined) updateData.is_borrowed = is_borrowed;
    if (borrower_name !== undefined) updateData.borrower_name = borrower_name;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    const updatedAsset = await db.update(assets)
      .set(updateData)
      .where(eq(assets.id, id))
      .returning();
      
    if (updatedAsset.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    res.json(updatedAsset[0]);
  } catch (error) {
    console.error("Update asset error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/api/assets/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const deletedAsset = await db.delete(assets)
      .where(eq(assets.id, id))
      .returning();
      
    if (deletedAsset.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    res.json({ message: "Asset deleted successfully", asset: deletedAsset[0] });
  } catch (error) {
    console.error("Delete asset error:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    // Tangkap custom error dari Multer fileFilter
    if (err.message && err.message.startsWith('Format file tidak didukung')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err.stack);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  next();
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

const fs = require('fs');
const crypto = require('crypto');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('import crypto from "crypto";')) {
    code = code.replace('import bcrypt from "bcryptjs";', 'import bcrypt from "bcryptjs";\nimport crypto from "crypto";');
}

const loginEnd = `    res.status(500).json({ error: "Database error occurred", details: error });
  }
});`;

const newEndpoints = `
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
      console.log(\`Reset token for \${username}: \${resetToken}\`);
      
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
});`;

if (!code.includes('/api/forgot-password')) {
    code = code.replace(loginEnd, loginEnd + newEndpoints);
    fs.writeFileSync('server.ts', code);
    console.log('Endpoints patched');
} else {
    console.log('Endpoints already exist');
}

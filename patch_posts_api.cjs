const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `app.get("/api/reports"`;
const replacement = `app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, category, eventDate, location } = req.body;
    let image = req.body.existingImage || null;
    
    if (req.file) {
      image = \`/uploads/\${req.file.filename}\`;
    }
    
    let eventDateParsed = null;
    if (eventDate) {
      eventDateParsed = new Date(\`\${eventDate}+07:00\`);
    }
    
    const updateData = {
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

app.get("/api/reports"`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with PUT/DELETE posts");

const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPosts.tsx', 'utf8');

// Replace standard confirm with a custom state
// 1. Add state for delete confirmation
const stateTarget = `const [editFormData, setEditFormData] = useState<Partial<Post>>({});`;
const newState = stateTarget + `
  const [postToDelete, setPostToDelete] = useState<number | null>(null);`;
code = code.replace(stateTarget, newState);

// 2. Modify handleDelete to open modal instead of confirm
const oldHandleDelete = `const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };`;
const newHandleDelete = `const confirmDelete = (id: number) => {
    setPostToDelete(id);
  };

  const executeDelete = async () => {
    if (postToDelete === null) return;
    try {
      const res = await fetch(\`/api/posts/\${postToDelete}\`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setPostToDelete(null);
    }
  };`;
code = code.replace(oldHandleDelete, newHandleDelete);

// 3. Update the onClick in the render loop
code = code.replace(`onClick={() => handleDelete(post.id)}`, `onClick={() => confirmDelete(post.id)}`);

// 4. Add the delete confirmation modal at the end before final closing div
const modalString = `
      {postToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-sm w-full shadow-ambient text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Hapus</h3>
            <p className="text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-6 py-2 rounded-full border border-outline-variant font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="px-6 py-2 rounded-full bg-error text-on-error font-bold hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}`;
      
code = code.replace("    </div>\n  );\n}", modalString + "\n    </div>\n  );\n}");

fs.writeFileSync('src/pages/AdminPosts.tsx', code);
console.log('Patched AdminPosts.tsx');

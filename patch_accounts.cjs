const fs = require('fs');
let code = fs.readFileSync('src/pages/AccountsRT.tsx', 'utf8');

// 1. Add state for delete confirmation
const stateTarget = `const [isAddModalOpen, setIsAddModalOpen] = useState(false);`;
const newState = stateTarget + `\n  const [userToDelete, setUserToDelete] = useState<number | null>(null);`;
code = code.replace(stateTarget, newState);

// 2. Modify handleDelete to just set the state
const oldHandleDelete = `const handleDelete = async (id: number) => {
    console.log("Mencoba menghapus user dengan ID:", id);
    if (!id) {
      alert("Error: ID user tidak ditemukan!");
      return;
    }
    
    if (window.confirm('Apakah Anda yakin ingin menghapus akun RT ini?')) {
      try {
        const res = await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
        if (res.ok) {
          await fetchUsers();
        } else {
          const errData = await res.json();
          alert(errData.error || 'Gagal menghapus dari server');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };`;

const newHandleDelete = `const confirmDelete = (id: number) => {
    setUserToDelete(id);
  };

  const executeDelete = async () => {
    if (userToDelete === null) return;
    try {
      const res = await fetch(\`/api/users/\${userToDelete}\`, { method: 'DELETE' });
      if (res.ok) {
        await fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal menghapus dari server');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserToDelete(null);
    }
  };`;

code = code.replace(oldHandleDelete, newHandleDelete);

// 3. Update the onClick in the render loop
code = code.replace(`onClick={() => handleDelete(user.id)}`, `onClick={() => confirmDelete(user.id)}`);

// 4. Add the delete confirmation modal at the end before final closing div
const modalString = `
      {/* Delete Confirmation Modal */}
      {userToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-sm w-full shadow-ambient text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Hapus</h3>
            <p className="text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus akun RT ini?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setUserToDelete(null)}
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

fs.writeFileSync('src/pages/AccountsRT.tsx', code);
console.log('Patched AccountsRT.tsx');

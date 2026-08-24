import { db } from "./src/db/index.ts";
import { users } from "./src/db/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function run() {
  const allUsers = await db.select().from(users);
  for (const user of allUsers) {
    if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.password, 10);
      await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));
      console.log(`Updated user ${user.username} with new hashed password`);
    }
  }
  process.exit(0);
}
run();

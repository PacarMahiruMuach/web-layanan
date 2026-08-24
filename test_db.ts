import { db } from './src/db/index';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';
async function run() {
  try {
    await db.insert(users).values({
      username: "test_rt",
      password: "password",
      name: "Test RT",
      role: "rt",
      rt_number: "RT 01"
    }).returning();
  } catch (error: any) {
    console.log("Error details:", error);
    console.log("String(error):", String(error));
    if (error.cause) console.log("error.cause:", error.cause);
  }
}
run();

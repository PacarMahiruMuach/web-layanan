import { db } from "./src/db/index.ts";
import { users } from "./src/db/schema.ts";

async function run() {
  const allUsers = await db.select().from(users);
  console.log(allUsers);
  process.exit(0);
}
run();

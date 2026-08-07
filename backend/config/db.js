import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve backend/.env explicitly so this works no matter which
// directory the process was launched from (e.g. `nodemon backend/server.js`
// run from the repo root, where process.cwd() is the root, not backend/).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to backend/.env (see .env.example).");
}

export const sql = neon(process.env.DATABASE_URL);
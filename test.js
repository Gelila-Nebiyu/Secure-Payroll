import sql from "./db.js";

async function testConnection() {
  try {
    const result = await sql`SELECT 1 + 1 AS sum`;
    console.log("Connected! Result:", result[0].sum);
  } catch (err) {
    console.error("Database error:", err);
  }
}

testConnection();

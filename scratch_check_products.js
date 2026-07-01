const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("No .env.local file found at", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function check() {
  try {
    const response = await fetch(`${url}/rest/v1/products?select=*&limit=1`, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP Error: ${response.status}\n${errorText}`);
      return;
    }

    const data = await response.json();
    console.log("Product record schema:", data[0]);
  } catch (err) {
    console.error(err);
  }
}

check();

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Helper function to execute and display commands
function execCommand(command) {
  console.log(`\n🔵 Executing: ${command}`);
  execSync(command, { stdio: "inherit" });
}

// Helper function for delay
function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function setupDatabase() {
  try {
    // 0. Verify/Extract Project ID from SUPABASE_URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.log("⚠️ NEXT_PUBLIC_SUPABASE_URL not found in .env");
      process.exit(1);
    }

    // Extract project ID from URL using regex
    const projectId = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
    if (!projectId) {
      console.log("⚠️ Could not extract Project ID from Supabase URL");
      process.exit(1);
    }

    console.log(`✓ Project ID detected: ${projectId}`);

    // 1. Login to Supabase
    console.log("\nLogging into Supabase...");
    execCommand("npx supabase login");
    console.log("✓ Logged into Supabase");

    // 2. Initialize Supabase if not initialized
    if (!fs.existsSync("supabase")) {
      console.log("\nInitializing Supabase...");
      execCommand("npx supabase init");
      console.log("✓ Supabase initialized");
    }

    // 3. Wait 5 seconds before linking
    console.log("\nWaiting 5 seconds before linking...");
    await sleep(5);

    // 4. Link project
    console.log("\nLinking Supabase project...");
    execCommand(`npx supabase link --project-ref ${projectId}`);
    console.log("✓ Project linked");

    // 5. Create migrations directory if it doesn't exist
    const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log("\n✓ Migrations directory created");
    }

    // 6. Clean old migrations
    const oldFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith("_initial_schema.sql"));

    if (oldFiles.length > 0) {
      console.log("\nCleaning old migrations...");
      oldFiles.forEach((file) => {
        fs.unlinkSync(path.join(migrationsDir, file));
        console.log(`✓ Removed old migration: ${file}`);
      });
    }

    // 7. Generate timestamp and copy schema
    const date = new Date();
    const timestamp = date
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");

    const sourceFile = path.join(process.cwd(), "schema.sql");
    const targetFile = path.join(
      migrationsDir,
      `${timestamp}_initial_schema.sql`
    );

    fs.copyFileSync(sourceFile, targetFile);
    console.log(`\n✓ Schema copied to: ${targetFile}`);

    // 8. Execute supabase db push
    console.log("\nApplying database changes...");
    execCommand("npx supabase db push");
    console.log("✓ Database successfully updated");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

setupDatabase();

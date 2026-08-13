const path = require("path");
const DataBase = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "tasks.db");

const db = new DataBase(dbPath);

// Create tasks table if it doesn't exist
db.prepare(`

     CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
    `).run();


// Insert starter tasks only if table is empty 
  const taskCount = db
  .prepare("SELECT COUNT(*) AS count FROM tasks")
  .get();

if (taskCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO tasks (title, done)
    VALUES (?, ?)
  `);

  insert.run("Learn Express", 1);
  insert.run("Build CRUD API", 0);
  insert.run("Connect CRUD API to SQLite", 0);
}




module.exports = db;
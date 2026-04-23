const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new Database("database.db");
console.log("Connected to SQLite DB");

// Create table
db.prepare(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll TEXT,
    department TEXT,
    marks INTEGER
)
`).run();

// HOME
app.get("/", (req, res) => {
    res.send("Backend working!");
});

// ➕ ADD
app.post("/add", (req, res) => {
    const { name, roll, department, marks } = req.body;

    db.prepare(
        "INSERT INTO students (name, roll, department, marks) VALUES (?, ?, ?, ?)"
    ).run(name, roll, department, marks);

    res.send("Student added successfully");
});

// 📋 VIEW
app.get("/students", (req, res) => {
    const rows = db.prepare("SELECT * FROM students").all();
    res.json(rows);
});

// ❌ DELETE
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.prepare("DELETE FROM students WHERE id=?").run(id);

    res.send("Student deleted");
});

// ✏️ UPDATE
app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, roll, department, marks } = req.body;

    db.prepare(
        "UPDATE students SET name=?, roll=?, department=?, marks=? WHERE id=?"
    ).run(name, roll, department, marks, id);

    res.send("Student updated");
});

// 🚀 SERVER (Render compatible)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
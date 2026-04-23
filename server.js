const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("DB Error:", err);
    } else {
        console.log("Connected to SQLite DB");
    }
});

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll TEXT,
    department TEXT,
    marks INTEGER
)
`);

// Home test
app.get("/", (req, res) => {
    res.send("Backend working!");
});


// ✅ ADD STUDENT API
app.post("/add", (req, res) => {
    const { name, roll, department, marks } = req.body;

    db.run(
        "INSERT INTO students (name, roll, department, marks) VALUES (?, ?, ?, ?)",
        [name, roll, department, marks],
        function (err) {
            if (err) {
                res.send("Error adding student");
            } else {
                res.send("Student added successfully");
            }
        }
    );
});


// ✅ VIEW STUDENTS API
app.get("/students", (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            res.send("Error fetching data");
        } else {
            res.json(rows);
        }
    });
});


// ✅ DELETE API (MOVE HERE)
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

     console.log("DELETE CALLED", id);  // 👈 add this

    db.run("DELETE FROM students WHERE id=?", [id], function (err) {
        if (err) {
            console.log(err);
            res.send("Error deleting");
        } else {
            res.send("Student deleted");
        }
    });
});


// 🚀 START SERVER (ALWAYS LAST)
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, roll, department, marks } = req.body;

    db.run(
        "UPDATE students SET name=?, roll=?, department=?, marks=? WHERE id=?",
        [name, roll, department, marks, id],
        function (err) {
            if (err) {
                res.send("Error updating");
            } else {
                res.send("Student updated");
            }
        }
    );
});
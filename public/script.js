if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/login.html";
}

let allStudents = [];
let editId = null;

const API = "http://localhost:3000";

// Add student
function addStudent() {
    let data = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        department: document.getElementById("dept").value,
        marks: document.getElementById("marks").value
    };

    if (editId === null) {
        // ➕ ADD NEW STUDENT
        fetch("http://localhost:3000/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => loadStudents());
    } else {
        // ✏️ UPDATE EXISTING STUDENT
        fetch("http://localhost:3000/update/" + editId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            editId = null; // reset after update
            loadStudents();
        });
    }
}


// Load students
function loadStudents() {
    fetch("http://localhost:3000/students")
        .then(res => res.json())
        .then(data => {
            allStudents = data;   // store all students
            displayStudents(data);
        });
}

function editStudent(id, name, roll, dept, marks) {
    document.getElementById("name").value = name;
    document.getElementById("roll").value = roll;
    document.getElementById("dept").value = dept;
    document.getElementById("marks").value = marks;

    editId = id;
}

// Delete student
function deleteStudent(id) {
    fetch("http://localhost:3000/delete/" + id, {
        method: "DELETE"
    })
    .then(() => loadStudents());
}

function displayStudents(data) {
    let list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(s => {
        list.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.roll}</td>
            <td>${s.department}</td>
            <td>${s.marks}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editStudent(${s.id}, '${s.name}', '${s.roll}', '${s.department}', ${s.marks})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})">Delete</button>
            </td>
        </tr>`;
    });
}

function searchStudents() {
    let value = document.getElementById("search").value.toLowerCase();

    let filtered = allStudents.filter(s =>
        s.name.toLowerCase().includes(value) ||
        s.roll.toLowerCase().includes(value) ||
        s.department.toLowerCase().includes(value)
    );

    displayStudents(filtered);
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "/login.html";
}
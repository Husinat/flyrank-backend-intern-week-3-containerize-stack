const express = require('express');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const db = require("./database/db");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = 5000;

// STAGE 0 
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});


// STAGE 2






// get tasks routes
app.get("/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();

    res.json(tasks);
});


// get task by id route
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.json(task);
});




// STAGE 3
// posting a new task route
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const result = db
        .prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
        .run(title, 0);

    const newTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(result.lastInsertRowid);

    res.status(201).json(newTask);
});






// STAGE 4 AND 5
// UPDATE & DELETE TASKS

// Update task
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const existingTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    if (
        (title !== undefined && (typeof title !== "string" || title.trim() === "")) ||
        (done !== undefined && typeof done !== "boolean") ||
        (title === undefined && done === undefined)
    ) {
        return res.status(400).json({
            error: "Provide a valid title and/or done status"
        });
    }

    const updatedTitle = title !== undefined ? title : existingTask.title;
    const updatedDone = done !== undefined ? (done ? 1 : 0) : existingTask.done;

    db.prepare(`
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
    `).run(updatedTitle, updatedDone, id);

    const updatedTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    res.json(updatedTask);
});





// Delete task
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const existingTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    res.status(204).send();
});








app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
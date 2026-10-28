require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const taskRepository = require("./database/taskRepository");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

// Home
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

// Get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await taskRepository.getAll();
    res.json(tasks);
});

// Get task by ID
app.get("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    const task = await taskRepository.getById(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.json(task);
});

// Create a task
app.post("/tasks", async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = await taskRepository.create(title);

    res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const existingTask = await taskRepository.getById(id);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    if (
        (title !== undefined &&
            (typeof title !== "string" || title.trim() === "")) ||
        (done !== undefined && typeof done !== "boolean") ||
        (title === undefined && done === undefined)
    ) {
        return res.status(400).json({
            error: "Provide a valid title and/or done status"
        });
    }

    const updatedTitle =
        title !== undefined ? title : existingTask.title;

    const updatedDone =
        done !== undefined ? done : existingTask.done;

    const updatedTask = await taskRepository.update(
        id,
        updatedTitle,
        updatedDone
    );

    res.json(updatedTask);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    const existingTask = await taskRepository.getById(id);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    await taskRepository.remove(id);

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
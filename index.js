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
const tasks = [
    {
        id: 1,
        title: "Learn Express",
        done: true
    },
    {
        id: 2,
        title: "Build CRUD API",
        done: false
    },
    {
        id: 3,
        title: "Submit Week 2 Assignment",
        done: false
    }
];

// get tasks routes
app.get("/tasks", (req, res) => {
    res.json(tasks);
});


// get task by id route
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

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

  const newTask = {
    id: tasks.length + 1,
    title,
    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});


// STAGE 4 AND 5
// UPDATE & DELETE TASKS

// Update task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  const { title, done } = req.body;

  if (
    (title !== undefined && title.trim() === "") ||
    (title === undefined && done === undefined)
  ) {
    return res.status(400).json({
      error: "Provide a valid title and/or done status"
    });
  }

  if (title !== undefined) {
    task.title = title;
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});


// Delete task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});








app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
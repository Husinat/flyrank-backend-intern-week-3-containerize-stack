const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const getAll = async () => {
    const result = await pool.query(
        "SELECT * FROM tasks ORDER BY id"
    );
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

const create = async (title) => {
    const result = await pool.query(
        "INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *",
        [title, false]
    );
    return result.rows[0];
};

const update = async (id, title, done) => {
    const result = await pool.query(
        `UPDATE tasks
         SET title = $1, done = $2
         WHERE id = $3
         RETURNING *`,
        [title, done, id]
    );
    return result.rows[0];
};

const remove = async (id) => {
    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
import express from "express";
import Database from "better-sqlite3";

const db = new Database('./db.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING,
    age INTEGE
    )`).run()

const getAll = () => db.prepare(`SELECT * FROM users`).all()
const getUserById = (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)
const createUser = (name, age) => db.prepare(`INSERT INTO users (name, age) VALUES (?, ?)`).run(name, age)
const updateUser = (id, name, age) => db.prepare(`UPDATE users SET name = ?, age = ? WHERE id = ?`).run(name, age, id)
const deleteUser = (id) => db.prepare(`DELETE FROM users WHERE id = ?`).run(id)

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
  try {
    const users = getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ messahe: error.message });
  }
});

app.get("/users/:id", (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ messahe: error.message });
  }
});

app.post("/users", (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || !age) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const result = createUser(name, age);
    res.status(201).json({ id: result.lastInsertRowid, name, age });
  } catch (error) {
    res.status(500).json({ messahe: error.message });
  }
});

app.put("/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { name, age } = req.body;
    if (!name || !age) {
      return res.status(400).json({ message: "Invalid data" });
    }
    updateUser(id, name, age);
    res.status(200).json({ id, name, age });
  } catch (error) {
    res.status(500).json({ messahe: error.message });
  }
});

app.delete("/users/:id", (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    deleteUser(req.params.id);
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log("Server runs on port 3000"));

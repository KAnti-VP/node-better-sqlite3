import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING,
    age INTEGE
    )`).run()

export const getAllUsers = () => db.prepare(`SELECT * FROM users`).all()
export const getUserById = (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)
export const createUser = (name, age) => db.prepare(`INSERT INTO users (name, age) VALUES (?, ?)`).run(name, age)
export const updateUser = (id, name, age) => db.prepare(`UPDATE users SET name = ?, age = ? WHERE id = ?`).run(name, age, id)
export const deleteUser = (id) => db.prepare(`DELETE FROM users WHERE id = ?`).run(id)

const users = [
  {name: 'Ann', age: 18}, {name: 'Bob', age: 19}, {name: 'Cloe', age: 20}
]

// for (const user of users) createUser(user.name, user.age)
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});

// Crée une table utilisateur si elle n'existe pas
await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

io.on("connection", (socket) => {
  console.log("Un joueur connecté");

  socket.on("register", async (pseudo) => {
    await db.execute("INSERT INTO users (pseudo) VALUES (?)", [pseudo]);
    socket.emit("enregistré", ⁠ Bienvenue pseudo ⁠);
  );

  socket.on("disconnect", () => 
    console.log("Joueur déconnecté");
  );
);

server.listen(process.env.PORT, () => 
  console.log(⁠ Serveur lancé sur le port{process.env.PORT} ⁠);
});

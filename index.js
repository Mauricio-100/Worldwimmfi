import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Connexion DB MySQL
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: true }
});

io.on("connection", (socket) => {
  console.log("✅ Nouveau joueur connecté :", socket.id);

  socket.on("register", async (pseudo) => {
    await db.execute("INSERT INTO joueurs (pseudo) VALUES (?)", [pseudo]);
    socket.emit("registered", ⁠ Bienvenue ${pseudo} ⁠);
  });

  socket.on("move", (data) => {
    socket.broadcast.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Joueur déconnecté :", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => 
  console.log(⁠ 🚀 Serveur Socket.IO prêt sur http://localhost:{PORT} ⁠);
});

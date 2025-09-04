import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mysql from "mysql2";

// App et serveur HTTP
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Connexion MySQL
const db = mysql.createConnection({
  host: "mysql-1a36101-botwii.c.aivencloud.com",
  port: 14721,
  user: "avnadmin",
  password: "AVNS_BvVULOCxM7CcMQd0Aqw",
  database: "defaultdb",
  ssl: { rejectUnauthorized: true }
});

db.connect(err => {
  if (err) {
    console.error("❌ Erreur MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
    initDatabase();
  }
});

// Création des tables si elles n'existent pas
function initDatabase() {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pseudo VARCHAR(100) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'offline',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createMessages = `
    CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(100),
      message TEXT,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createUsers, err => {
    if (err) console.error("⚠️ Erreur création table users :", err);
    else console.log("🧱 Table 'users' prête.");
  });

  db.query(createMessages, err => {
    if (err) console.error("⚠️ Erreur création table messages :", err);
    else console.log("🧱 Table 'messages' prête.");
  });
}

// Socket.IO
io.on("connection", socket => {
  console.log("👤 Connecté :", socket.id);

  socket.on("register", pseudo => {
    db.query("INSERT IGNORE INTO users (pseudo, status) VALUES (?, 'online')", [pseudo]);
    socket.emit("registered", ⁠ Bienvenue pseudo ⁠);
    io.emit("user_connected", pseudo);
  );

  socket.on("message", data => 
    db.query("INSERT INTO messages (sender, message) VALUES (?, ?)", [data.sender, data.text]);
    io.emit("message", data);
  );

  socket.on("disconnect", () => 
    console.log("🔌 Déconnecté :", socket.id);
  );
);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => 
  console.log(⁠ 🚀 Serveur en ligne sur le port{PORT} ⁠);
});

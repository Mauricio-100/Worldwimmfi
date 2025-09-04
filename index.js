import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*" // Accepte les connexions de n'importe quelle origine
  }
});

// Connexion à la base de données
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
    try {
      // Insertion du pseudo dans la base de données
      await db.execute("INSERT INTO users (pseudo) VALUES (?)", [pseudo]);
      // Envoi d'un message de confirmation au client
      socket.emit("enregistré", `Bienvenue ${pseudo}`); // CORRECTION ICI
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  }); // CORRECTION ICI

  socket.on("disconnect", () => {
    console.log("Joueur déconnecté");
  }); // CORRECTION ICI
}); // CORRECTION ICI

server.listen(process.env.PORT, () => {
  // CORRECTION ICI: Utilisation des backticks pour inclure la variable
  console.log(`Serveur lancé sur le port ${process.env.PORT}`);
});

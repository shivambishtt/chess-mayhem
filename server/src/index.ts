import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const PORT = Number(process.env.PORT || 9090);
const wss = new WebSocketServer({ port: PORT });
const gameManager = new GameManager();

wss.on("connection", function connection(socket) {
  gameManager.userPlays(socket);
  socket.on("disconnect", () => {
    gameManager.userLeaves(socket);
  });
});

console.log(`Websocket server running at PORT ${PORT}`);

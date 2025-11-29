import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { connectDB } from "./db/db";


const PORT = Number(process.env.PORT || 9090);
const wss = new WebSocketServer({ port: PORT });
const gameManager = new GameManager();

wss.on("connection", function connection(socket) {
  gameManager.userPlays(socket);
  socket.on("close", () => {
    gameManager.userLeaves(socket);
  });
});

connectDB()
  .then(() => {
    console.log("MONGODB connected successfully..!!");
  })
  .catch((err) => {
    console.log(err);
  });

console.log(`Websocket server running at PORT ${PORT}`);

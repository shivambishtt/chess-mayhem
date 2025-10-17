import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME } from "./messages";

export class GameManager {
  private games: Game[];
  private users: WebSocket[];
  private pendingUser: WebSocket;

  constructor() {
    this.games = [];
  }
  userPlays(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  userLeaves(socket: WebSocket) {
    this.users = this.users.filter((user) => {
      return user !== socket;
    });
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString()); //ensures that our message is a string and not json
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
            
        } else {
          this.pendingUser = socket;    
        }
      }
    });
  }
}

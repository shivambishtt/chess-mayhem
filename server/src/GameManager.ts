import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  private games: Game[];
  private users: WebSocket[];
  private pendingUser: WebSocket | null;

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  userPlays(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  userLeaves(socket: WebSocket) {
    this.users = this.users.filter((user) => {
      return user !== socket;
    });
    
    // Remove user from all games
    this.games.forEach(game => {
      game.removeUser(socket);
    });
    
    // Clean up empty games
    this.games = this.games.filter(game => game.players.length > 0);
  }

  private checkPendingUser(socket: WebSocket) {
    if (this.pendingUser) {
      const game = new Game(this.pendingUser, socket);
      this.games.push(game); //pushing into global game array
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString()); //ensures that our message is a string and not json

      if (message.type === INIT_GAME) {
        this.checkPendingUser(socket);
      } else {
        this.pendingUser = socket;
      }
      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.players.includes(socket) || game.spectators.includes(socket)
        );
        if (game) {
          game.makeMove(socket, message.move); //user making the move
        }
      }
    });
  }
}

// if the user has pressed moved then the game array should store the moves of the user

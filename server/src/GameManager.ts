import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  private games: Game[];
  private users: WebSocket[] = [];
  private pendingUser: WebSocket | null = null;

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
        const game = new Game(this.pendingUser!, socket);
        this.pendingUser = null;
        this.games.push(game);
        if (this.pendingUser) {
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}

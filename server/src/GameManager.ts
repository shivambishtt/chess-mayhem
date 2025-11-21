import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";
import { prisma } from "./db/prisma";

export class GameManager {
  private games: Game[];
  private users: WebSocket[] = [];
  private pendingUser: WebSocket | null = null;
  private chess: any;

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
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString()); //ensures that our message is a string and not json
      if (message.type === INIT_GAME) {
        if (!this.pendingUser) {
          this.pendingUser = socket;
        } else {
      const game = new Game(this.pendingUser, socket);
          const dbgame = await prisma.game.create({
            data:{
              player1Id:crypto.randomUUID(),
              player2Id:crypto.randomUUID(),
              
            }
          });

          this.games.push(game);
          this.pendingUser = null;
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.payload);
        }
      }
    });
  }
}

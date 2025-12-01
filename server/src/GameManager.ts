import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";
import { Move } from "./models/MoveModel";
import { GameModel } from "./models/GameModel";

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
          // new game created add in db

          await GameModel.create({
            gameId: game.id,
            playerWhite: game.player1,
            playerBlack: game.player2,
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
          //user moves store it in moves table which has foreign key to game table
          const move = await game.makeMove(socket, message.payload);
          if (move) {
            const moveCreated = await Move.create({
              gameId: game.id,
              from: move.from,
              to: move.to,
            });
            return moveCreated;
          }
          return move;
        }
      }
    });
  }
}

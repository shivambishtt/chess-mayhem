import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";
import { Move } from "./models/MoveModel";
import { GameModel } from "./models/GameModel";

export interface PlayerSocket extends WebSocket {
  userId?: string;
}

export class GameManager {
  private games: Game[];
  private users: PlayerSocket[] = [];
  private pendingUser: PlayerSocket | null = null;
  private chess: any;

  constructor() {
    this.games = [];
  }
  userPlays(socket: PlayerSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  userLeaves(socket: PlayerSocket) {
    this.users = this.users.filter((user) => {
      return user !== socket;
    });
  }

  private addHandler(socket: PlayerSocket) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString()); //ensures that our message is a string and not json
      if (message.type === INIT_GAME) {
        if (!this.pendingUser) {
          this.pendingUser = socket;
        } else {
          // start a new game and add it in database
          const game = new Game(this.pendingUser, socket);

          const newGame = await GameModel.create({
            gameId: game.id,
            player1: this.pendingUser!.userId,
            player2: socket.userId,
            moves: this.chess.history(),
            
          });
          return newGame;
          // this.games.push(newGame);
          // this.pendingUser = null;
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

import { WebSocket } from "ws";

export class Game {
  private game: Game[];
  private player1: WebSocket;
  private player2: WebSocket;
  private chessboard: string;
  private moves: string[];
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    (this.player1 = player1), (this.player2 = player2), (this.chessboard = "");
    this.moves = [];
    this.startTime = new Date()
  }
}

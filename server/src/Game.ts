import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();

    // Send init to both players
    [this.player1, this.player2].forEach((player, index) => {
      if (!player) {
        console.error("Player is null");
        return;
      } 
      const color = index === 0 ? "white" : "black";
      player.send(JSON.stringify({ type: INIT_GAME, payload: { color } }));
    });
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
      return;
    }
    if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
      return;
    }
    try {
      this.board.move(move);
    } catch (err) {
      return;
    }

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";
      const message = JSON.stringify({
        message: GAME_OVER,
        payload: { winner },
      });

      [this.player1, this.player2].forEach((player) => player.send(message));
    }

    //player 1 or 2 moves
    if (this.board.moves().length % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
  }
}

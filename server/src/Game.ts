import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { randomUUID } from "crypto";

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


  async makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // validate turn
    const turn = this.board.turn(); // "w" or "b"
    if (turn === "w" && socket !== this.player1) {
      return;
    }
    if (turn === "b" && socket !== this.player2) {
      return;
    }

    // try to make the move
    try {
      this.board.move(move);
    } catch (err) {
      console.log("Invalid move", err);
      return;
    }

    // broadcast move to both players
    const message = JSON.stringify({
      type: MOVE,
      payload: move,
    });

    this.player1.send(message);
    this.player2.send(message);

    // check game over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";

      const overMsg = JSON.stringify({
        type: GAME_OVER,
        payload: { winner },
      });

      this.player1.send(overMsg);
      this.player2.send(overMsg);
    }
  }

}

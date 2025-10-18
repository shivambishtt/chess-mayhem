import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { MOVE } from "./messages";

export class Game {
  public players: WebSocket[];
  public spectators: WebSocket[];
  private currentPlayerIndex: number;
  private startTime: Date;
  public board: Chess;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.players = [player1, player2];
    this.spectators = [];
    this.currentPlayerIndex = 0; // White starts first
    this.board = new Chess();
    this.startTime = new Date();
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    try {
      // Validate that the socket is a player in this game
      const playerIndex = this.players.findIndex(player => player === socket);
      if (playerIndex === -1) {
        socket.send(JSON.stringify({
          type: "error",
          message: "You are not a player in this game"
        }));
        return;
      }

      // Validate it's the correct player's turn
      if (playerIndex !== this.currentPlayerIndex) {
        socket.send(JSON.stringify({
          type: "error", 
          message: "It's not your turn"
        }));
        return;
      }

      // Validate and make the move
      if (this.board.move(move)) {
        // Switch turns
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        // Broadcast move to all players and spectators
        this.broadcastMove(move, socket);
      } else {
        socket.send(JSON.stringify({
          type: "error",
          message: "Invalid move"
        }));
      }
    } catch (error) {
      socket.send(JSON.stringify({
        type: "error",
        message: "Move processing failed"
      }));
    }
  }

  private broadcastMove(move: any, sender: WebSocket) {
    const moveMessage = JSON.stringify({
      type: MOVE,
      move: move,
      currentPlayer: this.currentPlayerIndex,
      fen: this.board.fen() // Send current board state
    });

    // Send to all players
    this.players.forEach(player => {
      if (player.readyState === WebSocket.OPEN) {
        player.send(moveMessage);
      }
    });

    // Send to all spectators
    this.spectators.forEach(spectator => {
      if (spectator.readyState === WebSocket.OPEN) {
        spectator.send(moveMessage);
      }
    });
  }

  addSpectator(socket: WebSocket) {
    if (!this.players.includes(socket) && !this.spectators.includes(socket)) {
      this.spectators.push(socket);
      // Send current game state to new spectator
      socket.send(JSON.stringify({
        type: "game_state",
        fen: this.board.fen(),
        currentPlayer: this.currentPlayerIndex
      }));
    }
  }

  removeUser(socket: WebSocket) {
    // Remove from players
    const playerIndex = this.players.findIndex(player => player === socket);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
      // Handle game end if a player leaves
      this.handlePlayerDisconnect();
      return;
    }

    // Remove from spectators
    this.spectators = this.spectators.filter(spectator => spectator !== socket);
  }

  private handlePlayerDisconnect() {
    // Notify remaining players about disconnection
    const disconnectMessage = JSON.stringify({
      type: "player_disconnected",
      message: "Opponent has disconnected"
    });

    this.players.forEach(player => {
      if (player.readyState === WebSocket.OPEN) {
        player.send(disconnectMessage);
      }
    });

    this.spectators.forEach(spectator => {
      if (spectator.readyState === WebSocket.OPEN) {
        spectator.send(disconnectMessage);
      }
    });
  }
}

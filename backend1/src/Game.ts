import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moveCount: number;
  private moves: string[];
  private startGame: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moveCount = 0;
    this.moves = [];
    this.startGame = new Date();

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(user: WebSocket, move: { from: string; to: string }) {
    // validate
    if (this.moveCount % 2 === 0 && user !== this.player1) {
      console.log("return early 1 ");
      return;
    }
    if (this.moveCount % 2 === 1 && user !== this.player2) {
      console.log("return early 2 ");
      return;
    }

    try {
      this.board.move(move);
    } catch (err) {
      return;
    }

    if (this.board.isGameOver()) {
      // Send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() == "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() == "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    if (this.moveCount % 2 === 0) {
      console.log("player 1 move ..");
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      console.log("player 2 move ..");

      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    this.moveCount++;

    console.log("move count ++", this.moveCount);
  }
}

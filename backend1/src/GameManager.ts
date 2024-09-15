import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(user: WebSocket) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(user: WebSocket) {
    this.users.filter((currUser) => currUser !== user);
  }

  private addHandler(user: WebSocket) {
    user.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        console.log("init game");
        if (this.pendingUser) {
          // start game
          console.log("Start Game");

          const game = new Game(this.pendingUser, user);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          console.log("Waiting for user...");

          this.pendingUser = user;
        }
      }

      if (message.type === MOVE) {
        // find the game
        const game = this.games.find(
          (game) => game.player1 === user || game.player2 === user
        );
        if (game) {
          game.makeMove(user, message.move);
        }
      }
    });
  }
}

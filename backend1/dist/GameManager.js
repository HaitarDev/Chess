"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(user) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(user) {
        this.users.filter((currUser) => currUser !== user);
    }
    addHandler(user) {
        user.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message === messages_1.INIT_GAME) {
                console.log("init game");
                if (this.pendingUser) {
                    // start game
                    console.log("Start Game");
                    const game = new Game_1.Game(this.pendingUser, user);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log("Waiting for user...");
                    this.pendingUser = user;
                }
            }
            if (message === messages_1.MOVE) {
                // find the game
                const game = this.games.find((game) => game.player1 === user || game.player2 === user);
                if (game) {
                    game.makeMove(user, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;

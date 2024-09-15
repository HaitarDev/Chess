"use client";

import React, { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function GamePage() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  const handleStartGame = () => {
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Game Initialized");
          break;
        case MOVE:
          const move = message.move;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting ...</div>;
  return (
    <div className="p-8 grid grid-cols-6 max-w-screen-xl mx-auto">
      <div className=" col-span-4 ">
        <ChessBoard board={board} socket={socket} />
      </div>
      <div className=" col-span-2">
        <button
          onClick={handleStartGame}
          className="bg-orange-600 border border-white py-2 px-5 hover:bg-orange-700  hover:border-slate-400 transition-colors duration-150"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default GamePage;

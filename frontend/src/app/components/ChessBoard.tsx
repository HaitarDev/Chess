import { Color, PieceSymbol, Square } from "chess.js";
import React, { useState } from "react";
import { MOVE } from "../game/page";

function ChessBoard({
  board,
  socket,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  return (
    <div className="text-black">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              return (
                <div
                  onClick={() => {
                    // if no from set a one then set to
                    if (!from) {
                      setFrom(square?.square ?? null);
                    } else {
                      setTo(square?.square ?? null);
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: { from, to },
                        })
                      );
                    }
                  }}
                  key={j}
                  className={`w-24 h-24 ${
                    (i + j) % 2 === 0 ? "bg-green-600" : "bg-white"
                  }`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col ">
                      {square ? square.type : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default ChessBoard;

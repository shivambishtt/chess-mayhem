import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Online";

export const Chessboard = ({
  board,
  socket,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [to, setTo] = useState<null | Square>(null);
  return (
    <div className="text-black">
      {/* logic for row */}
      {board.map((row, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden"
          >
            {/* logic for column */}
            {row.map((column, j) => {
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(column?.square || null);
                    } else {
                      const nextSquare = column?.square || null; //next move to
                      setTo(nextSquare);
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from, // current address of the piece
                            to: nextSquare, //next address of the piece
                          },
                        })
                      );
                      console.log({ from, to });
                    }
                  }}
                  key={j}
                  className={`w-15 h-14 ${
                    (i + j) % 2 === 0 ? "bg-emerald-700" : "bg-amber-100"
                  }`}
                >
                  {/* Content of column */}
                  <div className="w-full flex justify-center items-center h-full">
                    <div className="flex justify-center ">
                      {column ? column.type : " "}
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
};

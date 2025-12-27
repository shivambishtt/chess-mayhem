import type { Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE, GET_LEGAL_MOVES } from "../screens/Online";

export const Chessboard = ({
  board,
  socket,
  lastMove = null,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
  lastMove?: { from: string; to: string } | null;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === GET_LEGAL_MOVES) {
        setLegalMoves(message.payload.legalMoves);
      }
    };
  }, [socket]);


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
              const squareRepresentation = (String.fromCharCode(65 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              const squareLower = squareRepresentation.toLowerCase();
              
              // Determine highlight color
              let bgColor = (i + j) % 2 === 0 ? "bg-emerald-700" : "bg-amber-100";
              
              // Highlight last move (from and to squares)
              if (lastMove && (squareLower === lastMove.from || squareLower === lastMove.to)) {
                bgColor = "bg-yellow-400";
              }
              
              // Highlight selected piece
              if (from && squareLower === from.toLowerCase()) {
                bgColor = "bg-blue-400";
              }
              
              // Highlight legal moves
              if (legalMoves.includes(squareLower)) {
                bgColor = "bg-green-400";
              }

              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation.toLowerCase() as Square);
                      // Request legal moves from server
                      socket.send(
                        JSON.stringify({
                          type: GET_LEGAL_MOVES,
                          payload: { square: squareRepresentation.toLowerCase() },
                        })
                      );
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from: from.toLowerCase(), // current address of the piece
                            to: squareRepresentation.toLowerCase(), //next address of the piece
                          },
                        })
                      );
                      console.log({
                        from: from.toLowerCase(),
                        to: squareRepresentation.toLowerCase(),
                      });
                      setFrom(null);
                      setLegalMoves([]);
                    }
                  }}
                  key={j}
                  className={`w-15 h-14 ${bgColor} cursor-pointer transition-colors`}
                >
                  {/* Content of column */}
                  <div className="w-full flex justify-center items-center h-full">
                    <div className="flex justify-center ">
                      {column ? <img  className="size-12" src={`/${column.color}${column.type}.png`} alt="" /> : " "}
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

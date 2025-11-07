import type { Color, PieceSymbol, Square } from "chess.js";

export const Chessboard = ({
  board,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
}) => {
  return (
    <div className="text-black">
      {board.map((row, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden"
          >
            {row.map((square, j) => {
              return (
                <div
                  key={j}
                  className={`w-15 h-14 ${
                    (i + j) % 2 === 0 ? "bg-emerald-700" : "bg-amber-100"
                  }`}
                >
                  <div className="w-full flex justify-center items-center h-full">
                    <div className="flex justify-center ">
                      {square ? square.type : " "}
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

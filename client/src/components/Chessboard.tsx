import type { Color, PieceSymbol, Square } from "chess.js";

export const Chessboard = ({
  board,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
}) => {
  return (
    <div className="text-white">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              return <div key={j}>{square ? square.type : " "}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
};

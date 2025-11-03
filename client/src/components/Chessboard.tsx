import type { Color, PieceSymbol, Square } from "chess.js";
import React from "react";

function Chessboard({
  board,
}: {
  board:
    | {
        square: Square;
        type: PieceSymbol;
        color: Color;
      }
    | null[][];
}) {
  return <div className="text-white">{children}</div>;
}

export default Chessboard;

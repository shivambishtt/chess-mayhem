import React, { useEffect, useState } from "react";
import { Chessboard } from "../components/Chessboard";
import Button from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function Online() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess()); // initialized chess instance
  const [chessBoard, setChessboard] = useState(chess.board());

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setChessboard(chess.board());
          console.log("Game initialized");
          break;

        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setChessboard(chess.board());
          console.log("Move made");
          break;
        }

        case GAME_OVER:
          console.log("Game is over");
          break;
      }
    };
  }, [chess, socket]);

  if (!socket || socket === null) {
    return <div>Connecting....</div>;
  }
  return (
    <div className="justify-center flex ">
      <div className="pt-8 max-w-5xl  w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center w-full col-span-2 ">
            <Chessboard socket={socket} board={chessBoard} />
            <Button
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
              }}
            >
              Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Online;

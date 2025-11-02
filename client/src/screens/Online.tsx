import React, { useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import Button from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function Online() {
  const socket = useSocket();
  const [board, setBoard] = useState(new Chess());
  const [ascii, setAscii] = useState(board.board());

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      switch (message.type) {
        case INIT_GAME:
          setBoard(new Chess());
          console.log("Game initialized");
          break;

        case MOVE: {
          const move = message.payload; 
          board.move(move);
          console.log("Move made");
          break;
        }

        case GAME_OVER:
          console.log("Game is over");
          break;
      }
    };
  }, [socket, board]);

  if (!socket || socket === null) {
    return <div>Connecting....</div>;
  }
  return (
    <div className="justify-center flex ">
      <div className="pt-8 max-w-5xl  w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-green-500 ">
            <Chessboard />
          </div>
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
  );
}

export default Online;

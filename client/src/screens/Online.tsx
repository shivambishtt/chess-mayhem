import { useEffect, useState } from "react";
import { Chessboard } from "../components/Chessboard";
import Button from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GET_LEGAL_MOVES = "get_legal_moves";

function Online() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess()); // initialized chess instance
  const [chessBoard, setChessboard] = useState(chess.board());
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChessboard(chess.board());
          console.log("Game initialized");
          break;

        case MOVE: {
          const moveData = message.payload.move;
          chess.move(moveData);
          setChessboard(chess.board());
          setLastMove(message.payload.lastMove);
          console.log("Move made");
          break;
        }

        case GAME_OVER:
          console.log("Game is over");
          break;

        case GET_LEGAL_MOVES:
          // This message is handled by the Chessboard component
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
            <Chessboard socket={socket} board={chessBoard} lastMove={lastMove} />
            <Button
              onClick={() => {
                console.log("Clicked");
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
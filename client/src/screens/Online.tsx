import React from "react";
import Chessboard from "../components/Chessboard";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Online() {
  const navigate = useNavigate();
  return (
    <div className="justify-center flex ">
      <div className="pt-8 max-w-5xl  w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-green-500 ">
            <Chessboard />
          </div>
          <Button onClick={() => navigate("/game")}>Let;s Play</Button>
        </div>
      </div>
    </div>
  );
}

export default Online;

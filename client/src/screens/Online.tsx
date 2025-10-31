import React from "react";
import Chessboard from "../components/Chessboard";

function Online() {
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-5xl ">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full ">
          <div className="bg-green-500 ">
            <Chessboard />
          </div>
          <button className="bg-red-500">Play</button>
        </div>
      </div>
    </div>
  );
}

export default Online;

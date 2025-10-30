import React from "react";
import chessboard from "../assets/chessboard.png";

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        <img
          src={chessboard}
          className="w-2/3 h-full object-cover rounded-lg"
          alt="chess"
          loading="lazy"
        />
      </div>
      <div className="flex">
        <h1 className="text-4xl font-bold ">
          Play Chess. <br />
          Improve your game and have fun.
        </h1>
        <p>Join a room to play chess with your friends.</p>
        <button>Get Started</button>
      </div>
      <div>
        <button className="bg-green-600 text-white p-2 rounded-md">Play Online</button>
      </div>
    </div>
  );
}

export default Landing;

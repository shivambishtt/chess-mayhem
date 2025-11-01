import chessboard from "../assets/chessboard.png";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="main flex flex-row items-center justify-center h-screen">
      <div className="flex-1 flex justify-center">
        <img
          src={chessboard}
          className="w-2/2 h-full object-cover rounded-lg"
          alt="chess"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center">
          Play Chess. <br />
          Improve your game.
        </h1>
        <div className="right mt-4 flex flex-col items-center">
          <p className="mb-2">Join a room to play chess with your friends.</p>
          <button className="bg-lime-500  font-semibold mb-2 px-30 py-3  text-white rounded-md">
            <div></div>
            Get Started
          </button>
          <button
            onClick={() => {
              navigate("/game");
            }}
            className="bg-lime-500 font-semibold text-white rounded-md px-30 py-3"
          >
            Play Online
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;

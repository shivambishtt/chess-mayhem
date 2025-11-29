import mongoose from "mongoose";

interface IGame extends mongoose.Document {
  playerWhite: string;
  playerBlack: string;
  moves: Array<string>;
  result: string;
  timestamps: Date;
}

const GameSchema = new mongoose.Schema<IGame>({
  playerWhite: {
    type: String,
    required: true,
  },
  playerBlack: {
    type: String,
    required: true,
  },
});

export const GameModel = mongoose.model<IGame>("GameSchema", GameSchema); // naming problem

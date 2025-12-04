import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  gameId: string;
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  moves: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const GameSchema = new Schema<IGame>(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
    },
    player1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moves: [
      {
        type: Schema.Types.ObjectId,
        ref: "Move",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const GameModel = mongoose.model<IGame>("Game", GameSchema);

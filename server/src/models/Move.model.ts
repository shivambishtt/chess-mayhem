import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const MoveSchema = new mongoose.Schema(
  {
    gameId:{
        type:uuid,
    },
    from:{
        type:String,
        required:true
    },
    to:{
         type:String,
        required:true
    },
    piece:{
        type:String,

    },
    color:{
        type:String,
    }
  },
  {
    timestamps: true,
  }
);
 
export const Move = mongoose.model("Move",MoveSchema);
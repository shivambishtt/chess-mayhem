import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

interface IMove{
  gameId:string,
  from:string,
  to:string,
  piece?:string,
  color?:string,
  timestamps?:Date
}

const MoveSchema = new mongoose.Schema<IMove>(
  {
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
 
export const Move = mongoose.model<IMove>("Move",MoveSchema);
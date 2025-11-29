import mongoose from "mongoose";

interface IUser{
  firstName:string,
  lastName:string,
  email:string,
  password:string,
  timestamps?:Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User",UserSchema);
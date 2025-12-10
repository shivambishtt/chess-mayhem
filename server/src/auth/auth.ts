import crypto from "crypto";
import { jsonwebtoken as jwt } from "jsonwebtoken";
import { User } from "../models/UserModel";
import { Mongoose } from "mongoose";

export async function generateAuthToken(userId: string): Promise<string> {}

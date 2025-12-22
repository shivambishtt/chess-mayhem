import jsonwebtoken, { SignOptions } from "jsonwebtoken";

interface Token {
  jwt: string;
  refreshTime: Date;
  expiryTime: Date;
}

export async function generateAuthToken(
  userId: string,
  expiryTime: string | number
): Promise<Token> {
  const signOptions: SignOptions = {
    expiresIn: expiryTime || "2d",
    algorithm: "HS256",
  };
  const token = jsonwebtoken.sign(
    { userId },
    process.env.JWT_SECRET_KEY as string,
    signOptions
  );
  const refreshTime = new Date();
  const expiryDate = new Date(refreshTime.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days example
  return {
    
    jwt: token,
    refreshTime,
    expiryTime: expiryDate,
  };
}

import jsonwebtoken from "jsonwebtoken";

interface Token {
  jwt: string;
  refreshTime: Date;
  expiryTime: Date;
}

export async function generateAuthToken(
  userId: string,
  expiryTime: string | number
) {
  const token = jsonwebtoken.sign(
    userId,
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: expiryTime || "2d",
      algorithm: "HS256",   
    }
  );
  return token;
}

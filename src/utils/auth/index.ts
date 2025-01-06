import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET as string;

async function verifyAuthentication(): Promise<boolean> {
  try {
    const cookie = await cookies();
    const token = cookie.get("sessionToken")?.value;
    if (!token) return false;
    const data = jwt.verify(token, SECRET_KEY);
    return Boolean(data);
  } catch {
    return false;
  }
}
export default verifyAuthentication;

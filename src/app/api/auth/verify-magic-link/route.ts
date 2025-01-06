import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded !== "object" || !decoded.email) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const sessionToken = jwt.sign({ email: decoded.email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/home`
    );
    response.cookies.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }
}

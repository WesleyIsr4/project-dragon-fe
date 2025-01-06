import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

interface LoginBody {
  username: string;
  password: string;
}

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(request: Request) {
  try {
    const { username, password }: LoginBody = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const { data: user, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (selectError) {
      console.error("[LOGIN] Error selecting user:", selectError);
      return NextResponse.json(
        { error: "Error fetching user data." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const response = NextResponse.json(
      {
        message: "Login successful!",
        userId: user.id,
        username: user.username,
      },
      { status: 200 }
    );

    response.cookies.set("sessionToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[LOGIN] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}

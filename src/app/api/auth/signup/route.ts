import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

type SignupPayload = {
  username: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { username, password }: SignupPayload = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (findError) {
      console.error("[SIGNUP] Error checking user existence:", findError);
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: insertError } = await supabase
      .from("users")
      .insert({ username, password: hashedPassword })
      .select()
      .single();

    if (insertError) {
      console.error("[SIGNUP] Error inserting user:", insertError);
      return NextResponse.json(
        { error: "Error creating user." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No data returned. Check RLS policies." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User created successfully!",
      userId: data.id,
    });
  } catch (err) {
    console.error("[SIGNUP] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}

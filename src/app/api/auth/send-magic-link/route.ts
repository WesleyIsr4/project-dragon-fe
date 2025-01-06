import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/email";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email é obrigatório." },
      { status: 400 }
    );
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "15m" });

  const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-magic-link?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: "Seu Magic Link para login",
      text: `Clique no link para acessar: ${magicLink}`,
      html: `<html>
           <body>
             <p>Hello,</p>
             <p>Click the button below to access your account:</p>
             <a href="${magicLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login</a>
             <p>If you did not request this login, please ignore this email.</p>
           </body>
         </html>`,
    });

    return NextResponse.json({ message: "Magic Link enviado com sucesso." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

import { Resend } from "resend";
import type * as T from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: T.SendEmailProps) => {
  try {
    const response = await resend.emails.send({
      from: "Project Dragon <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    return response;
  } catch (error) {
    throw new Error(`Algo de errado aconteceu! ${error}`);
  }
};

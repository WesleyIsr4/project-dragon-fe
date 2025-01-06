import LoginPage from "@/components/template/LoginTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Tela de login",
};

export default function Login() {
  return <LoginPage />;
}

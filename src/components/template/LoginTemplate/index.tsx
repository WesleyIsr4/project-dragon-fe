"use client";

import { useReducer, type ChangeEvent } from "react";

import styles from "./styles.module.css";
import type * as T from "./types";
import { useRouter } from "next/navigation";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const initialState: T.LoginState & { authMode: "login" | "signup" } = {
  username: "",
  password: "",
  email: "",
  message: "",
  isLoading: false,
  isEmailLogin: false,
  authMode: "login",
};

type LoginAction =
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_LOGIN_MODE" }
  | { type: "TOGGLE_AUTH_MODE" };

function loginReducer(
  state: typeof initialState,
  action: LoginAction
): typeof initialState {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_LOGIN_MODE":
      return {
        ...state,
        isEmailLogin: !state.isEmailLogin,
        email: "",
        username: "",
        password: "",
        message: "",
      };
    case "TOGGLE_AUTH_MODE":
      return {
        ...state,
        authMode: state.authMode === "login" ? "signup" : "login",
        message: "",
        username: "",
        password: "",
      };
    default:
      return state;
  }
}

export default function LoginPage() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const router = useRouter();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_USERNAME", payload: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_PASSWORD", payload: e.target.value });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EMAIL", payload: e.target.value });
  };

  const toggleLoginMode = () => {
    dispatch({ type: "TOGGLE_LOGIN_MODE" });
  };

  const toggleAuthMode = () => {
    dispatch({ type: "TOGGLE_AUTH_MODE" });
  };

  const handleSendMagicLink = async () => {
    if (!validateEmail(state.email)) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Por favor, insira um email válido.",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: "SET_MESSAGE",
          payload: "Link mágico enviado! Verifique seu email.",
        });
        dispatch({ type: "SET_EMAIL", payload: "" });
      } else {
        dispatch({ type: "SET_MESSAGE", payload: `Erro: ${data.error}` });
      }
    } catch (error) {
      dispatch({
        type: "SET_MESSAGE",
        payload: `Ocorreu um erro. Tente novamente mais tarde. ${error}`,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleUsernamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_MESSAGE", payload: "" });

    if (state.authMode === "signup" && state.password.length < 4) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "A senha deve ter pelo menos 4 caracteres.",
      });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const endpoint =
      state.authMode === "signup" ? "/api/auth/signup" : "/api/auth/signin";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao fazer login");
      }

      router.push("/home");

      dispatch({ type: "SET_MESSAGE", payload: data.message });
    } catch (error) {
      dispatch({ type: "SET_MESSAGE", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionLeft}>
        <h1 className={styles.title}>LOGIN TO DRAGON PROJECT</h1>
      </div>

      <div className={styles.sectionRight}>
        <div className={styles.formContainer}>
          {/* Se não estiver em "login via email", exibimos o formulário de username e password */}
          {!state.isEmailLogin && (
            <form
              className={styles.form}
              onSubmit={handleUsernamePasswordSubmit}
            >
              <h2>
                {state.authMode === "signup"
                  ? "Create your account"
                  : "Login with Username / Password"}
              </h2>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className={styles.input}
                  placeholder="Enter your username"
                  value={state.username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={state.password}
                  onChange={handlePasswordChange}
                />
              </div>
              {state.message && <p>{state.message}</p>}

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={state.isLoading}
              >
                {state.isLoading
                  ? "Processando..."
                  : state.authMode === "signup"
                  ? "Sign Up"
                  : "Login"}
              </button>

              <p className={styles.switchMode}>
                {state.authMode === "signup"
                  ? "Já tem conta? "
                  : "Ainda não tem conta? "}
                <span onClick={toggleAuthMode} className={styles.link}>
                  {state.authMode === "signup" ? "Fazer login" : "Criar conta"}
                </span>
                {" ou "}
                <span onClick={toggleLoginMode} className={styles.link}>
                  {state.isEmailLogin
                    ? "login via username & password"
                    : "login via email"}
                </span>
              </p>
            </form>
          )}

          {/* Formulário de login via email */}
          {state.isEmailLogin && (
            <form className={styles.form}>
              <h2>Login via Email</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="Enter your email"
                  value={state.email}
                  onChange={handleEmailChange}
                />
              </div>
              {state.message && <p>{state.message}</p>}

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleSendMagicLink}
                disabled={state.isLoading}
              >
                {state.isLoading ? "Sending..." : "Send Magic Link"}
              </button>

              <p className={styles.switchMode}>
                Or{" "}
                <span onClick={toggleLoginMode} className={styles.link}>
                  login via username & password
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

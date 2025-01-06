import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientRootLayout({ children }: Props) {
  return <>{children}</>;
}

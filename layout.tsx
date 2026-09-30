import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moje Sámoška | Čerstvé potraviny každý den",
  description:
    "Poctivé potraviny, čerstvý výběr a akční nabídky v sousedské sámošce. Prohlédněte si demo katalog Moje Sámoška.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}

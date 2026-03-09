import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bolão do Oscar 2026 | Amigos da Rua",
  description: "O bolão mais divertido do Oscar! Dê seus palpites e dispute com os Amigos da Rua.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-carnival noise-overlay min-h-screen">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

import "./globals.css";
import { Anton, DM_Sans, JetBrains_Mono } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Chapa Quente | Peça já",
  description: "Cardápio online da lanchonete Chapa Quente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body bg-stone-100 text-stone-800">{children}</body>
    </html>
  );
}

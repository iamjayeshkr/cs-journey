import type { Metadata } from "next";
import { Caveat, Lora, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The CS Journey — UGC NET Computer Science Adventure",
  description:
    "Master Computer Science one concept at a time, one kingdom at a time. A handcrafted gamified study journal for UGC NET & JRF.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${lora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink font-sans selection:bg-mustard/40 selection:text-ink">
        {children}
      </body>
    </html>
  );
}

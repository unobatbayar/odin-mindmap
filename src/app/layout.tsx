import type { Metadata } from "next";
import { Noto_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSans = Noto_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cyrillic",
});

export const metadata: Metadata = {
  title: "Odin Mindmap",
  description: "ClickUp даалгавруудыг интерактив оюуны зургаар харуулна",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${notoSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pyramid — Task Management",
  description: "Manage projects and tasks with your team.",
};

// Applies the persisted theme/accent before first paint to avoid a
// flash of the default theme. Reads the same localStorage key the
// zustand "theme-storage" persist store writes to.
const themeInitScript = `
(function () {
  try {
    var raw = localStorage.getItem("theme-storage");
    var state = raw ? JSON.parse(raw).state : null;
    document.documentElement.dataset.theme = (state && state.mode) || "light";
    document.documentElement.dataset.accent = (state && state.accentColor) || "Blue";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.accent = "Blue";
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--base-background)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

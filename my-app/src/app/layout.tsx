import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// The design system's `font-sans` token. globals.css maps this variable onto
// Tailwind's --font-sans so every `font-sans` utility resolves to Inter.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Used only where the design names Roboto explicitly (e.g. the Designer chip).
const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pyramid — Task Management",
  description: "Manage projects and tasks with your team.",
};

// Applies the persisted theme/accent before first paint to avoid a
// flash of the default theme. Reads the same localStorage key the
// zustand"theme-storage" persist store writes to.
const themeInitScript = `
(function () {
  try {
    var raw = localStorage.getItem("theme-storage");
    var state = raw ? JSON.parse(raw).state : null;
    document.documentElement.dataset.theme = (state && state.mode) ||"light";
    document.documentElement.dataset.accent = (state && state.accentColor) ||"Black";
  } catch (e) {
    document.documentElement.dataset.theme ="light";
    document.documentElement.dataset.accent ="Black";
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} h-full antialiased`}
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

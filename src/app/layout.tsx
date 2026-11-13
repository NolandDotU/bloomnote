import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomnote — a little world, made for someone",
  description: "Private animated gifts for the people you keep close."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

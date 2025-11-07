import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QOTE × AlphaEvolve × Resona",
  description: "When Mathematics Learned to Breathe - AI-accelerated mathematical discovery with biological coherence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

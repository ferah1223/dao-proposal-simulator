import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "GovSim - DAO Proposal Simulator & Voting UI",
  description: "Simulate vote impact before casting your vote. Browse DAOs, proposals, and participate in governance with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

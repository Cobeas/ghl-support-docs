import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Basic auth app",
  description: "A starter template for building an app with basic authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
    <SessionProvider session={session} key={session?.user?.email || "no-user"}>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Navbar />
          {children}
        </AppRouterCacheProvider>
      </body>
      </SessionProvider>
    </html>
  );
}

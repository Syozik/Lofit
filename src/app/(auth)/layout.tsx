import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lofit - Sign In",
  icons: "/lofit_logo.svg",
  description: "Sign in to Lofit",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`${inter.className} mt-[70px] flex flex-col items-center justify-center`}>
        {children}
    </div>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lofit",
  description: "Lofit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.topbar}>
          <img src="lofit_logo.svg" alt="logo" className="logo" />
          <div className={styles.functions}>
            <Link href="/settings">
              <img src="/settings.svg" className="icon" />
            </Link>
            <Link href="/sign-out">Sign out</Link>
          </div>
        </div>
        <div className="mid">
          <div className={styles.sidebar}>
            <ul className={styles.sidebarList}>
              <li>
                <Link href="/balance">Balance</Link>
              </li>
              <li>
                <Link href="/history">Check history</Link>
              </li>
              <li style={{ textDecoration: "none" }} className="add">
                Add ...
                <ul
                  className={styles.addList}
                  style={{ textDecoration: "underline" }}
                >
                  <li>
                    <Link href="/expense">Expense</Link>
                  </li>
                  <li>
                    <Link href="/income">Income</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}

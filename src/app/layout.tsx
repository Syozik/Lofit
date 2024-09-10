import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5d6b83] to-[#141429]">{children}</body>
    </html>
  );
}
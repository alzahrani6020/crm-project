import type { Metadata } from "next";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "CRM Admin",
  description: "CRM Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc' }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}

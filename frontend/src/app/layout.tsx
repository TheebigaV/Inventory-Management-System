import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "InvenTrack - Inventory Management System",
  description: "A modern inventory management system for tracking items, storage, and borrowings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1f35',
                color: '#f1f5f9',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

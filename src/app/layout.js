
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import "sweetalert2/dist/sweetalert2.min.css";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Formiqo — Your Documents, One Workspace",
    template: "%s | Formiqo",
  },
  description:
    "Create professional invoices, quotations, receipts, CVs, letters, and business documents with Formiqo.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <SessionProvider>
          <Suspense
            fallback={
              <header className="h-18 border-b border-gray-200 bg-white" />
            }
          >
            <Header />
          </Suspense>

          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

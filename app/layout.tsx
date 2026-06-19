import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import the Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electro Arts | Automation Solutions",
  description: "Driving Automation. Delivering Excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {/* min-h-screen ensures the footer stays at the bottom even on short pages */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow bg-slate-50/50">{children}</main>
          <Footer /> {/* Add the Footer here */}
        </div>
      </body>
    </html>
  );
}

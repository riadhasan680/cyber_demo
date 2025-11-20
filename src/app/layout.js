import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SEC_OPS // Cyber Dashboard",
  description: "Advanced Cybersecurity Operations Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cyber-black text-cyber-green min-h-screen`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen pt-16 md:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Domain Price Checker",
  description: "Compare domain prices across registrars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Cheapest domain names from 139 registrars
                </h1>
              </div>
              {/* <nav className="hidden sm:block">
                <div className="flex space-x-8">
                  <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Home
                  </a>
                  <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    About
                  </a>
                </div>
              </nav> */}
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © 2025 Domain Price Checker. Compare domain prices across registrars.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

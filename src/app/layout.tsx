import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import "./globals.css";
import { Toaster } from "sonner";
import { Footer } from "react-day-picker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaHub — Hot & Fresh Pizza Delivered",
  description: "Order hot and fresh pizza from your favorite local vendors.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-red-50/25">
        
         
          <main className="flex-1 flex flex-col">{children}</main>
          
          <Toaster position="top-right" richColors />
           
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home - Custom PC Builder",
  description: "Design, customize, and build PC: Your journey to crafting the perfect machine starts here. Unlock the potential of your imagination with BuildPC, the gateway to personalized computing excellence",
  keywords: ["PC builder", "Computers", "building PC", "Custom PC"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     <Providers>
    //       <Toaster
    //         position="top-right"
    //         toastOptions={{
    //           duration: 3000,
    //           style: {
    //             background: '#1e293b',
    //             color: '#fff',
    //             border: '1px solid #334155',
    //           },
    //           success: {
    //             style: {
    //               background: '#1e293b',
    //               border: '1px solid #7ED348',
    //             },
    //           },
    //           error: {
    //             style: {
    //               background: '#1e293b',
    //               border: '1px solid #ef4444',
    //             },
    //           },
    //         }}
    //       />
    //       <Header />
    //       <Navbar />
    //       {children}
    //       <Footer />
    //     </Providers>
    //   </body>
    // </html>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
              },
              success: {
                style: {
                  background: "#1e293b",
                  border: "1px solid #7ED348",
                },
              },
              error: {
                style: {
                  background: "#1e293b",
                  border: "1px solid #ef4444",
                },
              },
            }}
          />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

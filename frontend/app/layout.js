import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/Layout";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { UserProvider } from "@/components/contexts/userContext";
import { CustomerProvider } from "@/components/contexts/customerContext";
import { JewelerProvider } from "@/components/contexts/jewelerContext";
import { useUserProfile } from "@/components/contexts/userContext";
import { useContext } from "react";
import { Suspense } from "react/cjs/react.development";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "GoldChain App",
  description: "NFT certificates for your jewelry",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <UserProvider>
            <JewelerProvider>
              <CustomerProvider>
                <Suspense>
                  <Layout>{children}</Layout>
                </Suspense>                
              </CustomerProvider>
            </JewelerProvider>            
          </UserProvider>          
        </Providers>
      </body>
    </html>
  );
}

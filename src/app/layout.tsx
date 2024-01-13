import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Providers from "@/components/Providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: "Alfred",
    description: "An assitant that will actually help you",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <Providers>
                <body className={inter.className}>
                    <main>{children}</main>
                </body>
            </Providers>
        </html>
    );
}

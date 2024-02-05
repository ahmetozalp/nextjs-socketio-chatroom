import "./globals.css";
import {Inter} from "next/font/google";
import {SocketProvider} from "@/app/context/socket.context";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "Chat App",
    description: "chat uygulaması task için geliştirildi",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <SocketProvider>
            <html lang="en">
            <body
                suppressHydrationWarning={true}
                className={inter.className}>
            {children}
            </body>
            </html>
        </SocketProvider>
    );
}

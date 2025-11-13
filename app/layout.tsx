import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./webos.css";
import QueryProvider from "./components/query/QueryProvider";
import { ServiceWorkerProvider } from "./components/ServiceWorkerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sil Screener",
  description: "Sil Screener",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-icon"
          href="/apple-icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="icon"
          href="/icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icon.png"
          type="image/<generated>"
          media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-3`}
      >
        <QueryProvider>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

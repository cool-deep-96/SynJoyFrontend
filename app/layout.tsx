import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://synjoy.vercel.app/"),
  title: {
    template: "Synjoy",
    default: "SynJoy- Sync Your Enjoyment with Onine Friends",
  },
  description: "Create movie rooms, sync play, and enjoy together",
  publisher: "@cool_deep_96",
  applicationName: "synjoy",
  verification: {
    google: "google",
    other: {
      me: ["my-email", "my-link", "github"],
    },
  },

  keywords: [
    "Sync Player",
    "Watch Party",
    "Watch together",
    "Online Party",
    "Sync Vibes",
    "Youtube Video Sync",
    "Create Room ",
    "Online Theater",
    "Online Theater At Home",
    "Long Distance Party",
    "Parth Together",
  ],

  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    images: ["/images/logoS.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-black ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

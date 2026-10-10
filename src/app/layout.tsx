import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/600.css";
import "./globals.css";
import { LangProvider } from "@/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://labour.canada.nshipyard.com"),
  title: "Cross-Border Labour Tightness | Open Nshipyard",
  description:
    "The US and Canada both publish job vacancy rates, but the raw numbers are not comparable. 44 quarters harmonized onto identical definitions: which side of the border has the tighter labour market?",
  openGraph: {
    title: "Cross-Border Labour Tightness | Open Nshipyard",
    description:
      "One vacancy rate, two countries, identical definitions. The US has been tighter in every quarter since 2015.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cross-Border Labour Tightness | Open Nshipyard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross-Border Labour Tightness | Open Nshipyard",
    description:
      "One vacancy rate, two countries, identical definitions. The US has been tighter in every quarter since 2015.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}

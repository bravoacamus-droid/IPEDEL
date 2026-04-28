import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ipedelperu.com"),
  title: {
    default: "IPE del Perú SAC — Agente de carga internacional",
    template: "%s · IPE del Perú",
  },
  description:
    "Agencia de carga internacional con más de 30 años de experiencia. Servicios aéreos, marítimos y terrestres. Red de agentes en más de 40 países. Tracking por HBL.",
  applicationName: "IPE del Perú SAC",
  authors: [{ name: "IPE del Perú SAC" }],
  keywords: [
    "agente de carga", "freight forwarder Perú", "carga aérea", "carga marítima",
    "tracking HBL", "VUCE", "agenciamiento aduanero", "Lima", "IPE del Perú",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "IPE del Perú SAC",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-ink-900">{children}</body>
    </html>
  );
}

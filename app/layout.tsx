import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/public/Preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ipeperu.com"),
  title: {
    default: "IPE del Perú SAC — Agente de carga internacional",
    template: "%s · IPE del Perú",
  },
  description:
    "Agencia de carga internacional con más de 30 años de experiencia. Servicios aéreos, marítimos y terrestres. Red de agentes en más de 40 países. Tracking por HBL.",
  applicationName: "IPE del Perú SAC",
  authors: [{ name: "IPE del Perú SAC" }],
  keywords: [
    "agente de carga",
    "freight forwarder Perú",
    "carga aérea",
    "carga marítima",
    "tracking HBL",
    "VUCE",
    "agenciamiento aduanero",
    "Lima",
    "IPE del Perú",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "IPE del Perú SAC",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // No definimos icons aquí: Next.js auto-detecta app/favicon.ico (un
  // .ico multi-resolución proper 16x16 + 32x32). Antes había un override
  // a /logo-vertical.png que a 16px se renderizaba como un triángulo
  // negro porque el PNG no estaba optimizado para tamaños tan chicos.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-ink-900">
        <Preloader />
        {children}
      </body>
    </html>
  );
}

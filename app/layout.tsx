import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "AFTER! — 5 jeux pour retourner ta soirée",
    description: "Vérité ou gage, mimes, bouteille, Qui de nous et défis éclair. Pose ton téléphone et joue pour de vrai.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "AFTER! — 5 jeux pour retourner ta soirée",
      description: "Pose ton téléphone. Joue pour de vrai.",
      locale: "fr_FR",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "AFTER! — 5 jeux pour retourner ta soirée" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "AFTER! — 5 jeux pour retourner ta soirée",
      description: "Pose ton téléphone. Joue pour de vrai.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

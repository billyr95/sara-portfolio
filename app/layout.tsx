import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SARA | Visual Portfolio',
  description: 'A curated collection of visual work spanning fashion, documentary, and experimental photography & film.',
  keywords: ['portfolio', 'photography', 'film', 'fashion', 'creative'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

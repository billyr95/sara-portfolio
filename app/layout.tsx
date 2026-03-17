import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sara Lukaszewski',
  description: 'Creative Direction, Costume, and Film',
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

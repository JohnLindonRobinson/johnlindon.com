import Layout from '@/components/Layout';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://johnlindon.com'),
  title: {
    default: 'John Robinson - Freelance Developer & Systems Consultant',
    template: '%s | John Robinson',
  },
  description:
    'Professional portfolio and services for John Robinson, specializing in web development, automation, and system consulting.',
  keywords: [
    'freelance developer',
    'systems consultant',
    'web development',
    'automation',
    'Notion',
    'edtech',
    'game development',
  ],
  authors: [{ name: 'John Robinson' }],
  creator: 'John Robinson',
  publisher: 'John Robinson',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://johnlindon.com',
    siteName: 'John Robinson',
    title: 'John Robinson - Freelance Developer & Systems Consultant',
    description:
      'Professional portfolio and services for John Robinson, specializing in web development, automation, and system consulting.',
    images: [
      {
        url: 'https://johnlindon.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'John Robinson - Freelance Developer & Systems Consultant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Robinson - Freelance Developer & Systems Consultant',
    description:
      'Professional portfolio and services for John Robinson, specializing in web development, automation, and system consulting.',
    images: ['https://johnlindon.com/og-image.jpg'],
    creator: '@JohnLindonRobinson',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

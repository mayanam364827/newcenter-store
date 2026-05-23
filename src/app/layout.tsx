import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEWCENTER.STORE - Mua Bán iPhone Chính Hãng Giá Tốt',
  description:
    'Chuyên mua bán iPhone chính hãng giá tốt tại TP HCM. Liên hệ Zalo: 0826000291 | 0377324973',
  keywords: 'mua bán iPhone, iPhone chính hãng, iPhone giá tốt, NEWCENTER STORE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

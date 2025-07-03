import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';
import "../globals.css";

const helveticaLTPro = localFont({
  src: [
    {
      path: '../../lib/fonts/HelveticaLTPro-Bold.otf',
      style: 'bold',
    },
    {
      path: '../../lib/fonts/HelveticaLTPro-Roman.otf',
      style: 'roman',
    },
  ],
})

const ns = Nunito_Sans({ 
  subsets: ['latin'],
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "Chronologix",
  description: "Work Force Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={ns.className} suppressHydrationWarning={true}>
        <ThemeProvider attribute="data-theme" disableTransitionOnChange defaultTheme="light-blue">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';
import "../globals.css";
import Navbar from "@/components/Navbar";

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
  title: "Chronologix - Dashboard",
  description: "Work Force Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={ns.className} suppressHydrationWarning={true}>
        <ThemeProvider attribute="data-theme" disableTransitionOnChange defaultTheme="light-blue">
          <main className="main-container flex cursor-default m-h-100vh">
            <div className="sidebar bg-foreground shadow-sidebar">
            </div>
            <div className="main-area w-full bg-background">
              <Navbar/>
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

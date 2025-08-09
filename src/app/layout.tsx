import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import "./rtl.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppThemeProvider } from "@/providers/app-theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { UserProvider } from "@/providers/user-provider";
import { UserRefreshProvider } from "@/providers/user-refresh-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Chronexa",
  description: "Chronexa - Your Chronological Experience",
};
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
      </head>
      <body className={`${nunitoSans.className} antialiased`}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppThemeProvider>
              <UserProvider>
                <UserRefreshProvider>
                  <SocketProvider
                    options={{
                      autoConnect: true,
                      reconnectOnUserChange: true,
                      enableLogging: process.env.NODE_ENV === "development",
                    }}
                  >
                    <main className="bg-background">
                      {children}
                      <Toaster />
                    </main>
                  </SocketProvider>
                </UserRefreshProvider>
              </UserProvider>
            </AppThemeProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

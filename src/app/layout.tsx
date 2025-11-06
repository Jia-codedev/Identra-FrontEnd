import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./rtl.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppThemeProvider } from "@/providers/app-theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { UserProvider } from "@/providers/user-provider";
import CustomQueryClientProvider from "@/providers/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export const metadata: Metadata = {
  title: "Identra - Your Employee Management System",
  description: "Identra - Your Employee Management System",
};
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body className={`${roboto.className} antialiased`}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppThemeProvider>
              <UserProvider>
                <CustomQueryClientProvider>
                  <SocketProvider
                    options={{
                      autoConnect: true,
                      reconnectOnUserChange: true,
                      enableLogging: process.env.NODE_ENV === "development",
                    }}
                  >
                    <main className="bg-background">
                      {children}
                      <Toaster position="top-right" />
                    </main>
                  </SocketProvider>
                </CustomQueryClientProvider>
              </UserProvider>
            </AppThemeProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

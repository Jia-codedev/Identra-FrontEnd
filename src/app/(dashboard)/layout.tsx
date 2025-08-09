import DashboardFadeInAnimation from "@/components/common/animations/dashboardFadeInAnimation";
// import ChatBotDemo from "@/components/common/dashboard/chatbot/ChatbotDemo";
import Navbar from "@/components/common/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomQueryClientProvider from "@/providers/QueryClientProvider";
import React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <CustomQueryClientProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="top-0 z-50">
          <Navbar />
        </header>
        <DashboardFadeInAnimation>
          <ScrollArea className="w-full h-full py-2">
            <div className="p-2">
              {children}
            </div>
          </ScrollArea>
        </DashboardFadeInAnimation>
        {/* <ChatBotDemo /> */}
      </div>
    </CustomQueryClientProvider>
  );
}

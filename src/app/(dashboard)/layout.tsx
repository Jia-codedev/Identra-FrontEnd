import DashboardFadeInAnimation from "@/components/common/animations/dashboardFadeInAnimation";
// import ChatBotDemo from "@/components/common/dashboard/chatbot/ChatbotDemo";
import Navbar from "@/components/common/Navbar";
import AppSidebar from "@/components/common/navbar/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CustomQueryClientProvider from "@/providers/QueryClientProvider";
import React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomQueryClientProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <DashboardFadeInAnimation>
            <ScrollArea className="flex-1 w-full h-[90vh] py-2">
              <div className="p-2">{children}</div>
            </ScrollArea>
          </DashboardFadeInAnimation>
        </SidebarInset>
        {/* <ChatBotDemo /> */}
      </SidebarProvider>
    </CustomQueryClientProvider>
  );
}

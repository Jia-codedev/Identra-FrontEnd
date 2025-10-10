import DashboardFadeInAnimation from "@/components/common/animations/dashboardFadeInAnimation";
// import ChatBotDemo from "@/components/common/dashboard/chatbot/ChatbotDemo";
import Navbar from "@/components/common/Navbar";
import AppSidebar from "@/components/common/navbar/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CustomQueryClientProvider from "@/providers/QueryClientProvider";
import NavigationSyncProvider from "@/components/providers/NavigationSyncProvider";
import React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomQueryClientProvider>
      <NavigationSyncProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Navbar />
            <DashboardFadeInAnimation>
              <ScrollArea className="flex-1 w-full max-h-[calc(100vh-var(--navbar-height))]">
                <div className="p-2">{children}</div>
              </ScrollArea>
            </DashboardFadeInAnimation>
          </SidebarInset>
          {/* <ChatBotDemo /> */}
        </SidebarProvider>
      </NavigationSyncProvider>
    </CustomQueryClientProvider>
  );
}

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../../components/app-sidebar";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col p-4">
          {/* Mobile Trigger: 
            Since the header is gone, we need a way to open the sidebar on mobile.
            "md:hidden" hides it on desktop screens.
          */}
          <SidebarTrigger className="md:hidden mb-4" />
          
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
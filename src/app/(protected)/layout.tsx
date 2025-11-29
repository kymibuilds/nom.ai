import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar (client component internally) */}
        <AppSidebar />

        <main className="flex flex-col flex-1 m-4 gap-4">
          <header
            className="
              h-12
              flex items-center justify-end
              bg-background
              border border-sidebar-border
              rounded-sm
              px-4
            "
          >
            <UserButton />
          </header>

          <section
            className="
              flex-1
              overflow-y-auto
              bg-background
              border border-sidebar-border
              rounded-sm
              p-4
            "
          >
            {children}
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
}

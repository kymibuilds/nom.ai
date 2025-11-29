import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import AppSidebar from "./app-sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main area */}
        <main className="flex flex-col flex-1 m-4 gap-4">
          {/* Top header bar */}
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

          {/* Content area */}
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
};

export default SidebarLayout;

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DollarSign,
  FileQuestionMark,
  LayoutDashboard,
  NotebookPen,
  Plus,
  Settings,
  Trash,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import SettingsModal from "@/components/modals/settings-modal";
import { useState } from "react";
import { CustomUserButton } from "@/components/user-button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q & A", url: "/qa", icon: FileQuestionMark },
  { title: "Meetings", url: "/meetings", icon: NotebookPen },
  { title: "Billing", url: "/billing", icon: DollarSign },
];

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const router = useRouter();
  const { projects, projectId, setProjectId } = useProject();
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* HEADER */}
      <SidebarHeader className="px-3">
        <div
          className="cursor-pointer"
          role="button"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo/logo.png" alt="logo" width={22} height={22} />
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="mt-2">
        {/* TOP SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3 text-xs font-medium group-data-[collapsible=icon]:hidden">
            Application
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      data-active={active}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PROJECTS */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-muted-foreground px-3 text-xs font-medium group-data-[collapsible=icon]:hidden">
            Your Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {(projects ?? []).map((project) => {
                const active = projectId === project.id;

                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      tooltip={project.name}
                      data-active={active}
                      onClick={() => setProjectId(project.id)}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-medium",
                        )}
                      >
                        {project.name?.[0]?.toUpperCase() ?? "P"}
                      </div>

                      <span className="truncate">{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* NEW PROJECT BUTTON */}
              <SidebarMenuItem>
                {open ? (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 px-2 text-sm"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Button>
                ) : (
                  <SidebarMenuButton
                    tooltip="New Project"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Project</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Recycle Bin">
              <Trash />
              <span>Recycle Bin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => setOpenSettings(true)}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
            <SettingsModal open={openSettings} onOpenChange={setOpenSettings} />
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* User Button Section */}
        <SidebarMenu>
           <SidebarMenuItem>
              <CustomUserButton />
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
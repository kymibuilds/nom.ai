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
  Inbox,
  LayoutDashboard,
  NotebookPen,
  Plus,
  Settings,
  Sparkle,
  Trash,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import SettingsModal from "@/components/modals/settings-modal";
import { useState } from "react";
import { CustomUserButton } from "@/components/user-button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Team", url: "/team", icon: Users },
  { title: "Q & A", url: "/qa", icon: FileQuestionMark },
  { title: "Meetings", url: "/meetings", icon: NotebookPen },
  { title: "Billing", url: "/billing", icon: DollarSign },
];

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { projects, projectId, setProjectId } = useProject();
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center justify-center py-2">
          <div
            className="cursor-pointer transition-opacity"
            role="button"
            onClick={() => router.push("/dashboard")}
          >
            <Image
              src="/logo/logo.png"
              alt="logo"
              width={30}
              height={30}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* APP ITEMS */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                      isActive={active}
                    >
                      <Link href={item.url}>
                        <Icon className="size-5" />
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
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(projects ?? []).map((project) => {
                const active = projectId === project.id;

                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      tooltip={project.name}
                      onClick={() => setProjectId(project.id)}
                      isActive={active}
                    >
                      <Sparkle className="size-5" />
                      <span className="truncate">{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* CREATE PROJECT */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Create Project"
                  onClick={() => router.push("/create")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-5" />
                  <span>New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* TRASH */}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Recycle Bin">
              {/* Enforce size-5 to match the project badge above */}
              <Trash className="size-5" />
              <span>Recycle Bin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* SETTINGS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => setOpenSettings(true)}
            >
              {/* Enforce size-5 to match the project badge above */}
              <Settings className="size-5" />
              <span>Settings</span>
            </SidebarMenuButton>
            <SettingsModal open={openSettings} onOpenChange={setOpenSettings} />
          </SidebarMenuItem>

          {/* USER */}
          <SidebarMenuItem>
            <div className="flex items-center justify-center pt-2">
              <CustomUserButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

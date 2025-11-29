"use client";

import {
  Sidebar,
  SidebarContent,
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
  Trash,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import { ModeToggle } from "@/components/theme-toggle-button";

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

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* HEADER */}
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Qode
          </span>
          <span className="hidden text-lg font-bold group-data-[collapsible=icon]:block">
            Q
          </span>
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
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-medium border"
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
                    className="w-full justify-start gap-2 px-2 text-sm text-muted-foreground hover:text-foreground"
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

      <div className="w-full flex items-center gap-1 px-2">
        <Trash className="w-4 h-4"/>
        <p>recycle bin</p>
      </div>

      <div className="p-3 mt-auto">
        <div className="flex justify-end group-data-[collapsible=icon]:justify-center">
          <ModeToggle />
        </div>
      </div>
    </Sidebar>
  );
}

export default AppSidebar;

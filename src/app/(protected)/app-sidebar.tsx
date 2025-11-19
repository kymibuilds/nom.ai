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
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q & A", url: "/qa", icon: FileQuestionMark },
  { title: "Meetings", url: "/meetings", icon: NotebookPen },
  { title: "Billing", url: "/billing", icon: DollarSign },
];

const projects = [
  { name: "project-1" },
  { name: "project-2" },
  { name: "project-3" },
];

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* HEADER */}
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Qode</span>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="mt-2">
        {/* TOP SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3">
            Application
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "hover:bg-accent/60"
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{item.title}</span>
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
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3">
            Your Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {projects.map((project) => {
                const active = pathname === `/projects/${project.name}`;

                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/projects/${project.name}`}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "hover:bg-accent/60"
                        )}
                      >
                        {/* Mini GitHub-style icon */}
                        <div className="h-5 w-5 flex items-center justify-center rounded-md bg-muted text-[10px] font-medium">
                          {project.name[0]?.toUpperCase() ?? ""}
                        </div>

                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* CREATE PROJECT BUTTON (GitHub style) */}
              {open ? (
                <SidebarMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-3 py-1.5 text-sm hover:bg-accent/60"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    New Project
                  </Button>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-accent/60"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;

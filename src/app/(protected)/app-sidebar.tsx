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
import useProject from "@/hooks/use-project";

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
    <Sidebar collapsible="icon" variant="floating">
      {/* HEADER */}
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Qode</span>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="mt-2">
        {/* TOP SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3 text-xs font-medium">
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
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "hover:bg-accent/60",
                        )}
                      >
                        <Icon className="text-muted-foreground h-4 w-4" />
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
          <SidebarGroupLabel className="text-muted-foreground px-3 text-xs font-medium">
            Your Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {(projects ?? []).map((project) => {
                const active = projectId === project.id;

                return (
                  <SidebarMenuItem
                    key={project.id}
                    onClick={() => setProjectId(project.id)}
                  >
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-accent text-foreground"
                          : "hover:bg-accent/60",
                      )}
                    >
                      {/* Badge */}
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-medium",
                          active
                            ? "bg-blue-500 text-white"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {project.name?.[0]?.toUpperCase() ?? ""}
                      </div>

                      <span className="truncate">{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {open ? (
                <SidebarMenuItem>
                  <Button
                    variant="ghost"
                    className="hover:bg-accent/60 w-full justify-start gap-2 px-3 py-1.5 text-sm"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="text-muted-foreground h-4 w-4" />
                    New Project
                  </Button>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-accent/60 h-8 w-8"
                    onClick={() => router.push("/create")}
                  >
                    <Plus className="text-muted-foreground h-4 w-4" />
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

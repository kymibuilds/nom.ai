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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q & A", url: "/qa", icon: FileQuestionMark },
  { title: "Meetings", url: "/meetings", icon: NotebookPen },
  { title: "Billing", url: "/billing", icon: DollarSign },
];

const projects = [
  { name: "project 1" },
  { name: "project 2" },
  { name: "project 3" },
];

function AppSidebar() {
  const pathName = usePathname();
  const { open } = useSidebar();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center justify-between pr-2">
          <span>Logo</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathName === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md",
                        active && "bg-primary text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {projects.map((project) => {
                const active = pathName === `/projects/${project.name}`;

                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/projects/${project.name}`}
                        className={cn(
                          "flex items-center gap-3 px-2 py-1.5 rounded-md",
                          active && "bg-primary text-white"
                        )}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-black/20 text-xs font-medium">
                          {project.name[0]?.toUpperCase() ?? "P"}
                        </div>

                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Create Project Button */}
              {
                open ? (
                  <SidebarMenuItem>
                <Button
                  className="w-full justify-start gap-2 px-2 py-1.5 shadow-none"
                  size="sm"
                  variant="outline"
                  onClick={()=>router.push("/create")}>
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </SidebarMenuItem>
                ) : <SidebarMenuItem><Button><Plus/></Button></SidebarMenuItem>
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronsUpDown, Loader2, LogOut, Settings } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function CustomUserButton() {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!isLoaded) return <Loader2 className="size-4 animate-spin text-muted-foreground" />;
  if (!user) return null;

  // Get initials for fallback
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Using SidebarMenuButton handles the "collapsed" state automatically. 
          size="lg" makes it 48px (h-12) tall to match your design.
        */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.imageUrl} srcSet={user.imageUrl} alt={user.fullName ?? ""} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
          </div>

          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.fullName}</span>
              <span className="truncate text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => openUserProfile()}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Manage Account</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-red-600 focus:text-red-600 focus:bg-red-100/40 dark:focus:bg-red-900/40"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
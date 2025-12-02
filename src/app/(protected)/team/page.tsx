"use client";

import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreVertical, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Trash2,
  Crown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InviteButton from "../dashboard/_components/invite-button";
import { toast } from "sonner";
import React from "react";

export default function TeamPage() {
  const { projectId } = useProject();
  const { data: members, isLoading } = api.project.getTeamMembers.useQuery({
    projectId,
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-8xl mx-auto py-6 md:py-8">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your team members, permissions, and invitations.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <InviteButton />
        </div>
      </div>

      <Card className="shadow-none border">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <CardTitle className="text-lg">Members</CardTitle>
                <CardDescription>
                    You have {members?.length ?? 0} active members in this project.
                </CardDescription>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter members..."
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 w-[350px]">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right pr-6">Access</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="pl-6"><div className="h-10 w-32 bg-muted rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-48 bg-muted rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-16 bg-muted rounded animate-pulse" /></TableCell>
                        <TableCell className="pr-6">
                          <div className="h-8 w-8 bg-muted rounded-full float-right animate-pulse" />
                        </TableCell>
                    </TableRow>
                ))
              ) : members?.map((m, index) => (
                <TableRow key={m.id} className="group">

                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={m.user.imageUrl ?? ""} />
                        <AvatarFallback>
                          {m.user.firstName?.[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground flex items-center gap-2">
                           {m.user.firstName} {m.user.lastName}
                           {index === 0 && (
                             <Crown className="h-3 w-3 text-muted-foreground" />
                           )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                           Active Member
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    {m.user.emailAddress}
                  </TableCell>

                  <TableCell>
                    {index === 0 ? (
                        <Badge variant="secondary" className="font-normal">
                            Owner
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            Contributor
                        </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => {
                            void navigator.clipboard.writeText(m.user.emailAddress ?? "");
                            toast.success("Email copied");
                          }}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Copy Email
                        </DropdownMenuItem>

                        {index !== 0 && (
                          <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove User
                            </DropdownMenuItem>
                          </>
                        )}

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && members?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <UserPlus className="h-8 w-8 text-muted-foreground/30" />
                        <p>No team members found.</p>
                        <InviteButton />
                    </div>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="User Management" subtitle="Manage students, teachers and administrators" />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search users..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Users className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">User list will appear here</p>
              <p className="text-xs text-center max-w-xs">
                Users registered through the API will be listed here with their roles and status.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

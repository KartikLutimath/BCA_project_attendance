"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { User, ApiResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserListResponse {
  users: (User & { createdAt: string })[];
  total: number;
  page: number;
  limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const roleConfig = {
  STUDENT: {
    label: "Student",
    icon: GraduationCap,
    badge: "bg-blue-100 text-blue-700",
    row: "hover:bg-blue-50/50",
  },
  TEACHER: {
    label: "Teacher",
    icon: BookOpen,
    badge: "bg-purple-100 text-purple-700",
    row: "hover:bg-purple-50/50",
  },
  ADMIN: {
    label: "Admin",
    icon: ShieldCheck,
    badge: "bg-orange-100 text-orange-700",
    row: "hover:bg-orange-50/50",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "STUDENT" | "TEACHER" | "ADMIN">("ALL");
  const queryClient = useQueryClient();
  const LIMIT = 10;

  // ── Fetch users ─────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin", "users", page, LIMIT],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<UserListResponse>>(
        ENDPOINTS.USERS.LIST,
        { params: { page, limit: LIMIT } }
      );
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });

  // ── Toggle active status ─────────────────────────────────────────────────────
  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const endpoint = isActive
        ? `${ENDPOINTS.USERS.BY_ID(id)}/deactivate`
        : `${ENDPOINTS.USERS.BY_ID(id)}/activate`;
      await apiClient.patch(endpoint);
    },
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "User deactivated" : "User activated");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast.error("Failed to update user status"),
  });

  // ── Filtered users (client-side search + role filter) ───────────────────────
  const allUsers = data?.users ?? [];
  const filtered = allUsers.filter((u) => {
    const matchSearch =
      search === "" ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil((data?.total ?? 0) / LIMIT);

  // ── Role counts from current page ───────────────────────────────────────────
  const counts = {
    STUDENT: allUsers.filter((u) => u.role === "STUDENT").length,
    TEACHER: allUsers.filter((u) => u.role === "TEACHER").length,
    ADMIN:   allUsers.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="User Management"
        subtitle={`${data?.total ?? 0} total users`}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {(["STUDENT", "TEACHER", "ADMIN"] as const).map((role) => {
            const cfg = roleConfig[role];
            return (
              <button
                key={role}
                onClick={() => setRoleFilter(roleFilter === role ? "ALL" : role)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all hover:shadow-md",
                  roleFilter === role ? "ring-2 ring-primary shadow-md" : "bg-white"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", cfg.badge)}>
                    {cfg.label}
                  </span>
                  <cfg.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{counts[role]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">on this page</p>
              </button>
            );
          })}
        </div>

        {/* Search + filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })}
            className="gap-1.5"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              All Users
              {filtered.length !== allUsers.length && (
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({filtered.length} of {allUsers.length} shown)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-0 divide-y">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-40 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-56 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-muted-foreground gap-3">
                <Users className="h-10 w-10 opacity-20" />
                <p className="text-sm font-medium">No users found</p>
                {search && (
                  <p className="text-xs">Try a different search term</p>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((user) => {
                  const cfg = roleConfig[user.role];
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 transition-colors",
                        cfg.row
                      )}
                    >
                      {/* Avatar */}
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full font-semibold text-sm shrink-0",
                        user.role === "STUDENT" ? "bg-blue-100 text-blue-700" :
                        user.role === "TEACHER" ? "bg-purple-100 text-purple-700" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{user.fullName}</p>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                            cfg.badge
                          )}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <Mail className="h-3 w-3 shrink-0" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Status + action */}
                      <div className="flex items-center gap-2 shrink-0">
                        {user.isActive ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactive
                          </span>
                        )}
                        <Button
                          variant={user.isActive ? "outline" : "success"}
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() =>
                            toggleActive.mutate({ id: user.id, isActive: user.isActive })
                          }
                          disabled={toggleActive.isPending}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} · {data?.total} users total
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

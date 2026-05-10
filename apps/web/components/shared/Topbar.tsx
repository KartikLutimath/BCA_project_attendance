"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/utils/format";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user } = useAuthStore();
  const today = formatDate(new Date());

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xs text-muted-foreground">{today}</span>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
          {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}

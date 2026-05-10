"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Calendar,
  Users,
  Settings,
  BookOpen,
  Building2,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mark Attendance", href: "/attendance", icon: ClipboardCheck },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { label: "Timetable", href: "/teacher/timetable", icon: Calendar },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const navItems =
    user?.role === "STUDENT"
      ? studentNav
      : user?.role === "TEACHER"
      ? teacherNav
      : adminNav;

  const roleLabel =
    user?.role === "STUDENT" ? "Student" : user?.role === "TEACHER" ? "Teacher" : "Administrator";

  const roleColor =
    user?.role === "STUDENT"
      ? "bg-blue-100 text-blue-700"
      : user?.role === "TEACHER"
      ? "bg-purple-100 text-purple-700"
      : "bg-orange-100 text-orange-700";

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">SmartAttendance</p>
          <p className="text-xs text-muted-foreground">AI Platform</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName ?? "User"}</p>
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", roleColor)}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

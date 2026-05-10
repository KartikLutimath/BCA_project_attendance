"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import {
  Users,
  Building2,
  BarChart3,
  ClipboardCheck,
  Settings,
  TrendingUp,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const adminModules = [
  { label: "User Management", desc: "Manage students, teachers, admins", icon: Users, href: "/admin/users", color: "blue" },
  { label: "Reports", desc: "Generate attendance reports", icon: BarChart3, href: "/admin/reports", color: "green" },
  { label: "Settings", desc: "System configuration", icon: Settings, href: "/admin/settings", color: "purple" },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title={`Admin Panel — ${user?.fullName ?? "Administrator"}`}
        subtitle="Institutional management overview"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "—", icon: Users, color: "bg-blue-50 text-blue-600" },
            { label: "Classrooms", value: "—", icon: Building2, color: "bg-green-50 text-green-600" },
            { label: "Subjects", value: "—", icon: BookOpen, color: "bg-purple-50 text-purple-600" },
            { label: "Sections", value: "—", icon: GraduationCap, color: "bg-orange-50 text-orange-600" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${s.color.split(" ")[0]}`}>
                <s.icon className={`h-4 w-4 ${s.color.split(" ")[1]}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {adminModules.map((mod, i) => (
            <Link key={i} href={mod.href}>
              <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <mod.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{mod.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* System info */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 shrink-0">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-orange-900">SmartAttendance AI — Admin Portal</p>
              <p className="text-sm text-orange-700 mt-1">
                Manage the entire institution from here. Configure classrooms, manage users, generate reports, and monitor attendance trends.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import {
  Users,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title={`Welcome, ${user?.fullName?.split(" ")[0] ?? "Teacher"}`}
        subtitle="Manage your classes and attendance"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Today's Classes", value: "—", icon: Calendar, color: "blue", sub: "Check timetable" },
            { label: "Pending Approvals", value: "—", icon: ClipboardCheck, color: "yellow", sub: "Attendance records" },
            { label: "Total Students", value: "—", icon: Users, color: "green", sub: "Across all sections" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "View Timetable", desc: "See your weekly schedule", icon: Calendar, href: "/teacher/timetable" },
              { label: "Manage Attendance", desc: "Approve or reject records", icon: ClipboardCheck, href: "/teacher/attendance" },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </a>
            ))}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">Teacher Portal</p>
              <p className="text-sm text-blue-700 mt-1">
                Use the navigation to manage your timetable, verify student attendance, and view class analytics.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

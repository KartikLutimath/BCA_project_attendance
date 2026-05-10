"use client";

import { Topbar } from "@/components/shared/Topbar";
import { AttendanceCard } from "@/components/attendance/AttendanceCard";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data: summary, isLoading } = useAttendanceSummary();

  const totalSubjects = summary?.length ?? 0;
  const safeSubjects = summary?.filter((s) => {
    const pct = s.total > 0 ? (s.present / s.total) * 100 : 0;
    return pct >= 75;
  }).length ?? 0;
  const overallPct =
    summary && summary.length > 0
      ? Math.round(
          summary.reduce((acc, s) => acc + (s.total > 0 ? (s.present / s.total) * 100 : 0), 0) /
            summary.length
        )
      : 0;

  const chartData = summary?.map((s) => ({
    name: s.subjectName.length > 10 ? s.subjectName.slice(0, 10) + "…" : s.subjectName,
    percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
  })) ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title={`Good ${getGreeting()}, ${user?.fullName?.split(" ")[0] ?? "Student"}`}
        subtitle="Here's your attendance overview"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Overall Attendance"
            value={`${overallPct}%`}
            icon={TrendingUp}
            color={overallPct >= 75 ? "green" : overallPct >= 60 ? "yellow" : "red"}
            sub={overallPct >= 75 ? "You're on track" : "Needs improvement"}
          />
          <StatCard
            label="Safe Subjects"
            value={`${safeSubjects}/${totalSubjects}`}
            icon={CheckCircle2}
            color="blue"
            sub="Above 75% threshold"
          />
          <StatCard
            label="At Risk"
            value={`${totalSubjects - safeSubjects}`}
            icon={AlertTriangle}
            color={totalSubjects - safeSubjects > 0 ? "red" : "green"}
            sub={totalSubjects - safeSubjects > 0 ? "Subjects below 75%" : "All subjects safe"}
          />
        </div>

        {/* Quick action */}
        <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Mark Today&apos;s Attendance</p>
                <p className="text-sm text-muted-foreground">GPS + biometric verification required</p>
              </div>
            </div>
            <Link href="/attendance">
              <Button className="gap-2">
                Mark Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                Attendance by Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <BookOpen className="h-8 w-8 opacity-30" />
                  <p className="text-sm">No attendance data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Attendance"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                    />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.percentage >= 75 ? "#22c55e" : entry.percentage >= 60 ? "#eab308" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Subject list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Subject Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                ))
              ) : summary && summary.length > 0 ? (
                summary.map((s) => (
                  <AttendanceCard
                    key={s.subjectId}
                    subjectName={s.subjectName}
                    present={s.present}
                    total={s.total}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                  <BookOpen className="h-8 w-8 opacity-30" />
                  <p className="text-sm">No subjects found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: "green" | "blue" | "red" | "yellow";
  sub: string;
}) {
  const colors = {
    green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600", text: "text-green-700" },
    blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", text: "text-blue-700" },
    red: { bg: "bg-red-50", icon: "bg-red-100 text-red-600", text: "text-red-700" },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-600", text: "text-yellow-700" },
  };
  const c = colors[color];

  return (
    <div className={`rounded-xl border p-5 ${c.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

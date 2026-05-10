"use client";

import { cn } from "@/lib/utils/cn";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AttendanceCardProps {
  subjectName: string;
  present: number;
  total: number;
  className?: string;
}

export function AttendanceCard({ subjectName, present, total, className }: AttendanceCardProps) {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  const isSafe = percentage >= 75;
  const isWarning = percentage >= 60 && percentage < 75;
  const isDanger = percentage < 60;

  const classesNeeded = isSafe
    ? 0
    : Math.ceil((0.75 * total - present) / 0.25);

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isSafe ? "bg-green-100" : isWarning ? "bg-yellow-100" : "bg-red-100"
          )}>
            <BookOpen className={cn(
              "h-4 w-4",
              isSafe ? "text-green-600" : isWarning ? "text-yellow-600" : "text-red-600"
            )} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{subjectName}</p>
            <p className="text-xs text-muted-foreground">{present}/{total} classes</p>
          </div>
        </div>

        <Badge variant={isSafe ? "success" : isWarning ? "warning" : "destructive"}>
          {isSafe ? (
            <><CheckCircle2 className="h-3 w-3 mr-1" />Safe</>
          ) : isDanger ? (
            <><AlertTriangle className="h-3 w-3 mr-1" />Detained</>
          ) : (
            <><TrendingUp className="h-3 w-3 mr-1" />Warning</>
          )}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Attendance</span>
          <span className={cn(
            "text-sm font-bold",
            isSafe ? "text-green-600" : isWarning ? "text-yellow-600" : "text-red-600"
          )}>
            {percentage}%
          </span>
        </div>
        <Progress
          value={percentage}
          className="h-2"
          indicatorClassName={cn(
            isSafe ? "bg-green-500" : isWarning ? "bg-yellow-500" : "bg-red-500"
          )}
        />
        {!isSafe && classesNeeded > 0 && (
          <p className="text-xs text-muted-foreground">
            Need <span className="font-semibold text-foreground">{classesNeeded}</span> more class{classesNeeded > 1 ? "es" : ""} to reach 75%
          </p>
        )}
      </div>
    </div>
  );
}

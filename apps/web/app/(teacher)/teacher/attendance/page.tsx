"use client";

import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSessionAttendance } from "@/hooks/useAttendance";
import { AttendanceService } from "@/services/attendance.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, MapPin, User, RefreshCw } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import { AttendanceRecord } from "@/types";

export default function TeacherAttendancePage() {
  const [timetableId, setTimetableId] = useState("");
  const [inputId, setInputId] = useState("");
  const queryClient = useQueryClient();

  const { data: records, isLoading } = useSessionAttendance(timetableId);

  const handleLoad = () => {
    if (inputId.trim()) setTimetableId(inputId.trim());
  };

  const handleApprove = async (id: string) => {
    try {
      await AttendanceService.approveAttendance(id);
      toast.success("Attendance approved");
      queryClient.invalidateQueries({ queryKey: ["attendance", "session", timetableId] });
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await AttendanceService.rejectAttendance(id, "Rejected by teacher");
      toast.success("Attendance rejected");
      queryClient.invalidateQueries({ queryKey: ["attendance", "session", timetableId] });
    } catch {
      toast.error("Failed to reject");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, "success" | "destructive" | "warning" | "info"> = {
      APPROVED: "success",
      REJECTED: "destructive",
      PENDING: "warning",
      FINALIZED: "info",
    };
    return <Badge variant={map[status] ?? "secondary"}>{status}</Badge>;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Attendance Management" subtitle="Review and verify student attendance" />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Session loader */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Load Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Enter Timetable ID..."
                className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button onClick={handleLoad} disabled={!inputId.trim()}>
                Load
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter the timetable slot ID to view today&apos;s attendance records.
            </p>
          </CardContent>
        </Card>

        {/* Records */}
        {timetableId && (
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Attendance Records
                {records && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({records.length} students)
                  </span>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["attendance", "session", timetableId] })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : records && records.length > 0 ? (
                <div className="space-y-3">
                  {records.map((record: AttendanceRecord) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Student ID: {record.studentId.slice(0, 8)}…</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(record.markedAt)}
                            </span>
                            {record.geofenceVerified && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <MapPin className="h-3 w-3" />
                                {record.distanceMeters ? `${Math.round(record.distanceMeters)}m` : "GPS verified"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {statusBadge(record.status)}
                        {record.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleApprove(record.id)}
                              className="h-7 px-2 text-xs"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(record.id)}
                              className="h-7 px-2 text-xs"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                  <ClipboardCheck className="h-8 w-8 opacity-30" />
                  <p className="text-sm">No attendance records for this session</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function ClipboardCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

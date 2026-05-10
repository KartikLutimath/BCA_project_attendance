"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AttendanceService } from "@/services/attendance.service";
import { useAttendanceStore } from "@/store/attendanceStore";
import { MarkAttendanceDTO } from "@/types";

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: () => AttendanceService.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAttendanceHistory(params?: {
  from?: string;
  to?: string;
  subjectId?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["attendance", "history", params],
    queryFn: () => AttendanceService.getHistory(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { setMarkingAttendance, setLastResult } = useAttendanceStore();

  return useMutation({
    mutationFn: (data: MarkAttendanceDTO) => AttendanceService.markAttendance(data),
    onMutate: () => setMarkingAttendance(true),
    onSuccess: (data) => {
      setMarkingAttendance(false);
      setLastResult({
        success: true,
        message: `Attendance marked for ${data.subject}`,
        geofenceVerified: data.geofenceVerified,
        distance: data.distance,
      });
      toast.success(`Attendance marked for ${data.subject}`);
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      setMarkingAttendance(false);
      const msg = error?.response?.data?.message || "Failed to mark attendance";
      setLastResult({ success: false, message: msg, geofenceVerified: false });
      toast.error(msg);
    },
  });
}

export function useSessionAttendance(timetableId: string, date?: string) {
  return useQuery({
    queryKey: ["attendance", "session", timetableId, date],
    queryFn: () => AttendanceService.getSessionAttendance(timetableId, date),
    enabled: !!timetableId,
  });
}

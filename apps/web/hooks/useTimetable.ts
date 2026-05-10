"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { TimetableSlot, ApiResponse } from "@/types";

export function useSectionSchedule(sectionId: string) {
  return useQuery({
    queryKey: ["timetable", "section", sectionId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Record<string, TimetableSlot[]>>>(
        ENDPOINTS.TIMETABLES.SECTION(sectionId)
      );
      return res.data.data;
    },
    enabled: !!sectionId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTeacherSchedule(teacherId: string) {
  return useQuery({
    queryKey: ["timetable", "teacher", teacherId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Record<string, TimetableSlot[]>>>(
        ENDPOINTS.TIMETABLES.TEACHER(teacherId)
      );
      return res.data.data;
    },
    enabled: !!teacherId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTimetableById(id: string) {
  return useQuery({
    queryKey: ["timetable", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<TimetableSlot>>(
        ENDPOINTS.TIMETABLES.BY_ID(id)
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}

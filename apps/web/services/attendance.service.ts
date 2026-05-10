import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  AttendanceRecord,
  AttendanceSummary,
  MarkAttendanceDTO,
  ApiResponse,
  GeofenceVerifyResult,
} from "@/types";

export const AttendanceService = {
  async markAttendance(data: MarkAttendanceDTO): Promise<{
    attendanceId: string;
    subject: string;
    markedAt: string;
    status: string;
    geofenceVerified: boolean;
    distance?: number;
  }> {
    const res = await apiClient.post<ApiResponse<{
      attendanceId: string;
      subject: string;
      markedAt: string;
      status: string;
      geofenceVerified: boolean;
      distance?: number;
    }>>(ENDPOINTS.ATTENDANCE.MARK, data);
    return res.data.data;
  },

  async getHistory(params?: {
    from?: string;
    to?: string;
    subjectId?: string;
    limit?: number;
    offset?: number;
  }): Promise<AttendanceRecord[]> {
    const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
      ENDPOINTS.ATTENDANCE.HISTORY,
      { params }
    );
    return res.data.data;
  },

  async getSummary(): Promise<AttendanceSummary[]> {
    const res = await apiClient.get<ApiResponse<AttendanceSummary[]>>(
      ENDPOINTS.ATTENDANCE.SUMMARY
    );
    return res.data.data;
  },

  async getSessionAttendance(timetableId: string, date?: string): Promise<AttendanceRecord[]> {
    const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
      ENDPOINTS.ATTENDANCE.SESSION(timetableId),
      { params: { date } }
    );
    return res.data.data;
  },

  async approveAttendance(id: string, reason?: string): Promise<AttendanceRecord> {
    const res = await apiClient.patch<ApiResponse<AttendanceRecord>>(
      ENDPOINTS.ATTENDANCE.APPROVE(id),
      { status: "APPROVED", reason: reason || "Approved by teacher" }
    );
    return res.data.data;
  },

  async rejectAttendance(id: string, reason: string): Promise<AttendanceRecord> {
    const res = await apiClient.patch<ApiResponse<AttendanceRecord>>(
      ENDPOINTS.ATTENDANCE.REJECT(id),
      { status: "REJECTED", reason }
    );
    return res.data.data;
  },

  async verifyLocation(
    timetableId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ): Promise<GeofenceVerifyResult> {
    const res = await apiClient.post<ApiResponse<GeofenceVerifyResult>>(
      ENDPOINTS.GEOFENCE.VERIFY,
      { timetableId, latitude, longitude, accuracy }
    );
    return res.data.data;
  },

  async markAbsentees(timetableId: string, date: string): Promise<{ marked: number }> {
    const res = await apiClient.post<ApiResponse<{ marked: number }>>(
      ENDPOINTS.ATTENDANCE.MARK_ABSENTEES,
      { timetableId, date }
    );
    return res.data.data;
  },
};

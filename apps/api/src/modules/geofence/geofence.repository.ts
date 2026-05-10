// geofence.repository.ts — Data Access Layer

import { prisma } from "@/config/database";
import { GeofenceValidationLog } from "./geofence.types";

export class GeofenceRepository {
  /**
   * Get classroom details by ID
   */
  static async getClassroomById(classroomId: string) {
    return prisma.classroom.findUnique({
      where: { id: classroomId },
    });
  }

  /**
   * Get all classrooms
   */
  static async getAllClassrooms() {
    return prisma.classroom.findMany({
      select: {
        id: true,
        name: true,
        building: true,
        latitude: true,
        longitude: true,
        radius: true,
      },
    });
  }

  /**
   * Update classroom geofence
   */
  static async updateClassroom(
    classroomId: string,
    data: { latitude?: number; longitude?: number; radius?: number }
  ) {
    return prisma.classroom.update({
      where: { id: classroomId },
      data,
    });
  }

  /**
   * Get timetable with classroom details
   */
  static async getTimetableWithClassroom(timetableId: string) {
    return prisma.timetable.findUnique({
      where: { id: timetableId },
      include: {
        classroom: true,
        subject: true,
        teacher: true,
        section: true,
      },
    });
  }

  /**
   * Check if classroom has valid geofence settings
   */
  static async hasValidGeofence(classroomId: string): Promise<boolean> {
    const classroom = await this.getClassroomById(classroomId);
    if (!classroom) return false;

    return (
      classroom.latitude !== null &&
      classroom.longitude !== null &&
      classroom.radius !== null &&
      classroom.radius > 0
    );
  }

  /**
   * Get all timetables for a classroom
   */
  static async getTimetablesByClassroom(classroomId: string) {
    return prisma.timetable.findMany({
      where: { classroomId },
      include: { subject: true, teacher: true, section: true },
    });
  }

  /**
   * Log geofence validation (for audit trail)
   */
  static async logGeofenceValidation(log: GeofenceValidationLog) {
    // Create a generic log entry (can be extended to dedicated table later)
    console.log("[GEOFENCE_LOG]", {
      event: "LOCATION_VERIFIED",
      ...log,
    });

    return {
      logged: true,
      timestamp: new Date(),
    };
  }
}

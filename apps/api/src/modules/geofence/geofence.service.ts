// geofence.service.ts — Geofence Business Logic

import { prisma } from "@/config/database";
import { AppError } from "@/common/errors";
import {
  haversineDistance,
  validateCoordinates,
  isAccuracyAcceptable,
  calculateMargin,
  isInsideGeofence,
  getAccuracyPercentage,
} from "./geofence.utils";
import { GeofenceInput, GeofenceResult, VerifyLocationDTO } from "./geofence.types";
import {
  GEOFENCE_ERROR_CODES,
  GEOFENCE_ERROR_MESSAGES,
  GPS_ACCURACY_THRESHOLD,
} from "./geofence.constants";

export class GeofenceService {
  /**
   * Main geofence validation method
   * Calculates distance and checks if student is inside classroom radius
   */
  static validate(input: GeofenceInput): GeofenceResult {
    // Validate coordinate ranges
    if (!validateCoordinates(input.studentLat, input.studentLng)) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.INVALID_COORDINATES],
        400,
        GEOFENCE_ERROR_CODES.INVALID_COORDINATES
      );
    }

    if (!validateCoordinates(input.classroomLat, input.classroomLng)) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND],
        400,
        GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND
      );
    }

    // Calculate distance using Haversine formula
    const distance = haversineDistance(
      input.studentLat,
      input.studentLng,
      input.classroomLat,
      input.classroomLng
    );

    // Check GPS accuracy if provided
    if (input.accuracy && !isAccuracyAcceptable(input.accuracy, GPS_ACCURACY_THRESHOLD)) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.GPS_ACCURACY_LOW],
        403,
        GEOFENCE_ERROR_CODES.GPS_ACCURACY_LOW
      );
    }

    // Check if inside geofence
    const isInside = isInsideGeofence(distance, input.allowedRadius);
    const margin = calculateMargin(distance, input.allowedRadius);

    if (!isInside) {
      throw new AppError(
        `You are ${Math.round(distance)}m away from the classroom (max ${input.allowedRadius}m allowed)`,
        403,
        GEOFENCE_ERROR_CODES.OUTSIDE_GEOFENCE
      );
    }

    return {
      isInside,
      distance: Math.round(distance),
      margin: Math.round(margin),
      accuracy: input.accuracy,
    };
  }

  /**
   * Verify location for a specific timetable slot
   * Fetches classroom details and performs geofence check
   */
  static async verifyLocation(studentLat: number, studentLng: number, timetableId: string) {
    // Fetch timetable with classroom details
    const timetable = await prisma.timetable.findUnique({
      where: { id: timetableId },
      include: { classroom: true },
    });

    if (!timetable) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.TIMETABLE_NOT_FOUND],
        404,
        GEOFENCE_ERROR_CODES.TIMETABLE_NOT_FOUND
      );
    }

    if (!timetable.classroom) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND],
        400,
        GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND
      );
    }

    // Perform geofence validation
    const result = this.validate({
      studentLat,
      studentLng,
      classroomLat: timetable.classroom.latitude,
      classroomLng: timetable.classroom.longitude,
      allowedRadius: timetable.classroom.radius,
    });

    return {
      isVerified: result.isInside,
      distance: result.distance,
      allowedRadius: timetable.classroom.radius,
      margin: result.margin,
      classroomName: timetable.classroom.name,
    };
  }

  /**
   * Get classroom location details
   */
  static async getClassroomLocation(classroomId: string) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND],
        404,
        GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND
      );
    }

    return {
      id: classroom.id,
      name: classroom.name,
      building: classroom.building,
      latitude: classroom.latitude,
      longitude: classroom.longitude,
      radius: classroom.radius,
    };
  }

  /**
   * Update classroom geofence settings (admin only)
   */
  static async updateClassroomLocation(
    classroomId: string,
    updates: { latitude?: number; longitude?: number; radius?: number }
  ) {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new AppError(
        GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND],
        404,
        GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND
      );
    }

    // Validate updates
    if (updates.latitude !== undefined || updates.longitude !== undefined) {
      const lat = updates.latitude ?? classroom.latitude;
      const lng = updates.longitude ?? classroom.longitude;

      if (!validateCoordinates(lat, lng)) {
        throw new AppError(
          GEOFENCE_ERROR_MESSAGES[GEOFENCE_ERROR_CODES.INVALID_COORDINATES],
          400,
          GEOFENCE_ERROR_CODES.INVALID_COORDINATES
        );
      }
    }

    // Update classroom
    const updated = await prisma.classroom.update({
      where: { id: classroomId },
      data: {
        latitude: updates.latitude ?? classroom.latitude,
        longitude: updates.longitude ?? classroom.longitude,
        radius: updates.radius ?? classroom.radius,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      latitude: updated.latitude,
      longitude: updated.longitude,
      radius: updated.radius,
      message: "Classroom location updated successfully",
    };
  }

  /**
   * Calculate distance between two points (utility)
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    return haversineDistance(lat1, lng1, lat2, lng2);
  }

  /**
   * Check if coordinates are within radius (utility)
   */
  static isWithinRadius(
    studentLat: number,
    studentLng: number,
    centerLat: number,
    centerLng: number,
    radiusM: number
  ): boolean {
    const distance = haversineDistance(studentLat, studentLng, centerLat, centerLng);
    return isInsideGeofence(distance, radiusM);
  }
}

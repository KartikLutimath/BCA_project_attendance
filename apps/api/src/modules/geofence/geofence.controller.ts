// geofence.controller.ts — HTTP Request Handlers

import { Request, Response, NextFunction } from "express";
import { GeofenceService } from "./geofence.service";
import { AppError } from "@/common/errors";
import { prisma } from "@/config/database";

export class GeofenceController {
  /**
   * Verify student location for attendance marking
   * POST /api/v1/geofence/verify
   */
  static async verifyLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { timetableId, latitude, longitude, accuracy } = req.body;

      if (!timetableId || latitude === undefined || longitude === undefined) {
        throw new AppError("timetableId, latitude, and longitude are required", 400);
      }

      const result = await GeofenceService.verifyLocation(latitude, longitude, timetableId, accuracy);

      res.json({
        success: true,
        data: {
          isVerified: result.isVerified,
          distance: result.distance,
          allowedRadius: result.allowedRadius,
          margin: result.margin,
          classroomName: result.classroomName,
          message: result.isVerified
            ? `You are ${result.distance}m from the classroom center`
            : "Outside classroom perimeter",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get classroom location details
   * GET /api/v1/geofence/classroom/:id
   */
  static async getClassroomLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await GeofenceService.getClassroomLocation(id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update classroom geofence settings (admin only)
   * PATCH /api/v1/geofence/classroom/:id
   */
  static async updateClassroomLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { latitude, longitude, allowedRadius } = req.body;

      // Only admins can update classroom locations
      if (req.user?.role !== "ADMIN") {
        throw new AppError("Only admins can update classroom locations", 403);
      }

      const result = await GeofenceService.updateClassroomLocation(id, {
        latitude,
        longitude,
        radius: allowedRadius,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all classrooms with their geofence details
   * GET /api/v1/geofence/classrooms
   */
  static async getAllClassrooms(req: Request, res: Response, next: NextFunction) {
    try {
      const classrooms = await prisma.classroom.findMany({
        select: {
          id: true,
          name: true,
          building: true,
          latitude: true,
          longitude: true,
          radius: true,
        },
      });

      res.json({
        success: true,
        data: classrooms,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calculate distance between two coordinates (utility)
   * POST /api/v1/geofence/distance
   */
  static async calculateDistance(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat1, lng1, lat2, lng2 } = req.body;

      if (lat1 === undefined || lng1 === undefined || lat2 === undefined || lng2 === undefined) {
        throw new AppError("All coordinates are required", 400);
      }

      const distance = GeofenceService.calculateDistance(lat1, lng1, lat2, lng2);

      res.json({
        success: true,
        data: {
          distance: Math.round(distance),
          unit: "metres",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { ClassroomsService } from "./classrooms.service";
import { success } from "@/common/response";
import { CreateClassroomDTO, UpdateClassroomDTO } from "./classrooms.validation";

export const createClassroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classroom = await ClassroomsService.createClassroom(req.body as CreateClassroomDTO);
    res.status(201).json(success("Classroom created", classroom));
  } catch (err) {
    next(err);
  }
};

export const listClassrooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classrooms = await ClassroomsService.listClassrooms();
    res.status(200).json(success("Classrooms fetched", classrooms));
  } catch (err) {
    next(err);
  }
};

export const getClassroomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classroom = await ClassroomsService.getClassroomById(req.params.id);
    res.status(200).json(success("Classroom fetched", classroom));
  } catch (err) {
    next(err);
  }
};

export const updateClassroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classroom = await ClassroomsService.updateClassroom(req.params.id, req.body as UpdateClassroomDTO);
    res.status(200).json(success("Classroom updated", classroom));
  } catch (err) {
    next(err);
  }
};

export const deleteClassroom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ClassroomsService.deleteClassroom(req.params.id);
    res.status(200).json(success("Classroom deleted"));
  } catch (err) {
    next(err);
  }
};

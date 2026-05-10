import { Request, Response, NextFunction } from "express";
import { SubjectsService } from "./subjects.service";
import { success } from "@/common/response";
import { CreateSubjectDTO, UpdateSubjectDTO } from "./subjects.validation";

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await SubjectsService.createSubject(req.body as CreateSubjectDTO);
    res.status(201).json(success("Subject created", subject));
  } catch (err) {
    next(err);
  }
};

export const listSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await SubjectsService.listSubjects();
    res.status(200).json(success("Subjects fetched", subjects));
  } catch (err) {
    next(err);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await SubjectsService.getSubjectById(req.params.id);
    res.status(200).json(success("Subject fetched", subject));
  } catch (err) {
    next(err);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await SubjectsService.updateSubject(req.params.id, req.body as UpdateSubjectDTO);
    res.status(200).json(success("Subject updated", subject));
  } catch (err) {
    next(err);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await SubjectsService.deleteSubject(req.params.id);
    res.status(200).json(success("Subject deleted"));
  } catch (err) {
    next(err);
  }
};

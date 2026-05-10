import { Request, Response, NextFunction } from "express";
import { SectionsService } from "./sections.service";
import { success } from "@/common/response";
import { CreateSectionDTO, UpdateSectionDTO } from "./sections.validation";

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await SectionsService.createSection(req.body as CreateSectionDTO);
    res.status(201).json(success("Section created", section));
  } catch (err) {
    next(err);
  }
};

export const listSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await SectionsService.listSections();
    res.status(200).json(success("Sections fetched", sections));
  } catch (err) {
    next(err);
  }
};

export const getSectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await SectionsService.getSectionById(req.params.id);
    res.status(200).json(success("Section fetched", section));
  } catch (err) {
    next(err);
  }
};

export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await SectionsService.updateSection(req.params.id, req.body as UpdateSectionDTO);
    res.status(200).json(success("Section updated", section));
  } catch (err) {
    next(err);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await SectionsService.deleteSection(req.params.id);
    res.status(200).json(success("Section deleted"));
  } catch (err) {
    next(err);
  }
};

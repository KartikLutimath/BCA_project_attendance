import { Request, Response, NextFunction } from "express";
import { DepartmentsService } from "./departments.service";
import { success } from "@/common/response";
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "./departments.validation";

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department = await DepartmentsService.createDepartment(req.body as CreateDepartmentDTO);
    res.status(201).json(success("Department created", department));
  } catch (err) {
    next(err);
  }
};

export const listDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await DepartmentsService.listDepartments();
    res.status(200).json(success("Departments fetched", departments));
  } catch (err) {
    next(err);
  }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department = await DepartmentsService.getDepartmentById(req.params.id);
    res.status(200).json(success("Department fetched", department));
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department = await DepartmentsService.updateDepartment(req.params.id, req.body as UpdateDepartmentDTO);
    res.status(200).json(success("Department updated", department));
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await DepartmentsService.deleteDepartment(req.params.id);
    res.status(200).json(success("Department deleted"));
  } catch (err) {
    next(err);
  }
};

import { DepartmentsRepository } from "./departments.repository";
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "./departments.validation";
import { NotFoundError, ConflictError } from "@/common/errors";

export class DepartmentsService {
  static async createDepartment(data: CreateDepartmentDTO) {
    const existing = await DepartmentsRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError(`Department with code ${data.code} already exists`);
    }
    return DepartmentsRepository.create(data);
  }

  static async listDepartments() {
    return DepartmentsRepository.findAll();
  }

  static async getDepartmentById(id: string) {
    const department = await DepartmentsRepository.findById(id);
    if (!department) throw new NotFoundError("Department");
    return department;
  }

  static async updateDepartment(id: string, data: UpdateDepartmentDTO) {
    if (data.code) {
      const existing = await DepartmentsRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Department with code ${data.code} already exists`);
      }
    }
    await this.getDepartmentById(id); // ensure exists
    return DepartmentsRepository.update(id, data);
  }

  static async deleteDepartment(id: string) {
    await this.getDepartmentById(id); // ensure exists
    // Handle relations conceptually — Prisma might block this if restrictive,
    // which is correct behavior.
    return DepartmentsRepository.delete(id);
  }
}

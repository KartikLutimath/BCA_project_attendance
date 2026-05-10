import { SubjectsRepository } from "./subjects.repository";
import { CreateSubjectDTO, UpdateSubjectDTO } from "./subjects.validation";
import { NotFoundError, ConflictError } from "@/common/errors";
import { DepartmentsService } from "@/modules/departments/departments.service";

export class SubjectsService {
  static async createSubject(data: CreateSubjectDTO) {
    // Validate department exists
    await DepartmentsService.getDepartmentById(data.departmentId);

    const existing = await SubjectsRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError(`Subject with code ${data.code} already exists`);
    }
    return SubjectsRepository.create(data);
  }

  static async listSubjects() {
    return SubjectsRepository.findAll();
  }

  static async getSubjectById(id: string) {
    const subject = await SubjectsRepository.findById(id);
    if (!subject) throw new NotFoundError("Subject");
    return subject;
  }

  static async updateSubject(id: string, data: UpdateSubjectDTO) {
    if (data.departmentId) {
      await DepartmentsService.getDepartmentById(data.departmentId);
    }

    if (data.code) {
      const existing = await SubjectsRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Subject with code ${data.code} already exists`);
      }
    }
    await this.getSubjectById(id);
    return SubjectsRepository.update(id, data);
  }

  static async deleteSubject(id: string) {
    await this.getSubjectById(id);
    return SubjectsRepository.delete(id);
  }
}

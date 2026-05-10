import { SectionsRepository } from "./sections.repository";
import { CreateSectionDTO, UpdateSectionDTO } from "./sections.validation";
import { NotFoundError } from "@/common/errors";
import { DepartmentsService } from "@/modules/departments/departments.service";

export class SectionsService {
  static async createSection(data: CreateSectionDTO) {
    // Validate department exists
    await DepartmentsService.getDepartmentById(data.departmentId);
    return SectionsRepository.create(data);
  }

  static async listSections() {
    return SectionsRepository.findAll();
  }

  static async getSectionById(id: string) {
    const section = await SectionsRepository.findById(id);
    if (!section) throw new NotFoundError("Section");
    return section;
  }

  static async updateSection(id: string, data: UpdateSectionDTO) {
    if (data.departmentId) {
      await DepartmentsService.getDepartmentById(data.departmentId);
    }
    await this.getSectionById(id);
    return SectionsRepository.update(id, data);
  }

  static async deleteSection(id: string) {
    await this.getSectionById(id);
    return SectionsRepository.delete(id);
  }
}

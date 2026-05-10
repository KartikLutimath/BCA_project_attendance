import { ClassroomsRepository } from "./classrooms.repository";
import { CreateClassroomDTO, UpdateClassroomDTO } from "./classrooms.validation";
import { NotFoundError, ConflictError } from "@/common/errors";

export class ClassroomsService {
  static async createClassroom(data: CreateClassroomDTO) {
    const existing = await ClassroomsRepository.findByName(data.name);
    if (existing) {
      throw new ConflictError(`Classroom with name ${data.name} already exists`);
    }
    return ClassroomsRepository.create(data);
  }

  static async listClassrooms() {
    return ClassroomsRepository.findAll();
  }

  static async getClassroomById(id: string) {
    const classroom = await ClassroomsRepository.findById(id);
    if (!classroom) throw new NotFoundError("Classroom");
    return classroom;
  }

  static async updateClassroom(id: string, data: UpdateClassroomDTO) {
    if (data.name) {
      const existing = await ClassroomsRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Classroom with name ${data.name} already exists`);
      }
    }
    await this.getClassroomById(id);
    return ClassroomsRepository.update(id, data);
  }

  static async deleteClassroom(id: string) {
    await this.getClassroomById(id);
    return ClassroomsRepository.delete(id);
  }
}

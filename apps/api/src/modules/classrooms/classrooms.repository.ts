import { prisma } from "@/config/database";
import { CreateClassroomDTO, UpdateClassroomDTO } from "./classrooms.validation";

export class ClassroomsRepository {
  static async create(data: CreateClassroomDTO) {
    return prisma.classroom.create({ data });
  }

  static async findAll() {
    return prisma.classroom.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async findById(id: string) {
    return prisma.classroom.findUnique({ where: { id } });
  }

  static async findByName(name: string) {
    return prisma.classroom.findUnique({ where: { name } });
  }

  static async update(id: string, data: UpdateClassroomDTO) {
    return prisma.classroom.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.classroom.delete({ where: { id } });
  }
}

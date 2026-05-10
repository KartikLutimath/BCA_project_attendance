import { prisma } from "@/config/database";
import { CreateSubjectDTO, UpdateSubjectDTO } from "./subjects.validation";

export class SubjectsRepository {
  static async create(data: CreateSubjectDTO) {
    return prisma.subject.create({ data });
  }

  static async findAll() {
    return prisma.subject.findMany({
      orderBy: { name: "asc" },
      include: { department: { select: { name: true, code: true } } },
    });
  }

  static async findById(id: string) {
    return prisma.subject.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  static async findByCode(code: string) {
    return prisma.subject.findUnique({ where: { code } });
  }

  static async update(id: string, data: UpdateSubjectDTO) {
    return prisma.subject.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.subject.delete({ where: { id } });
  }
}

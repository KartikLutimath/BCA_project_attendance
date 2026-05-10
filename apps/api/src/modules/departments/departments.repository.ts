import { prisma } from "@/config/database";
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "./departments.validation";

export class DepartmentsRepository {
  static async create(data: CreateDepartmentDTO) {
    return prisma.department.create({ data });
  }

  static async findAll() {
    return prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { subjects: true, sections: true, teachers: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        subjects: { orderBy: { name: "asc" } },
        sections: { orderBy: { semester: "asc" } },
      },
    });
  }

  static async findByCode(code: string) {
    return prisma.department.findUnique({ where: { code } });
  }

  static async update(id: string, data: UpdateDepartmentDTO) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.department.delete({ where: { id } });
  }
}

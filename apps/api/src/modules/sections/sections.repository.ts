import { prisma } from "@/config/database";
import { CreateSectionDTO, UpdateSectionDTO } from "./sections.validation";

export class SectionsRepository {
  static async create(data: CreateSectionDTO) {
    return prisma.section.create({ data });
  }

  static async findAll() {
    return prisma.section.findMany({
      orderBy: [{ semester: "asc" }, { name: "asc" }],
      include: { department: { select: { name: true, code: true } } },
    });
  }

  static async findById(id: string) {
    return prisma.section.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  static async update(id: string, data: UpdateSectionDTO) {
    return prisma.section.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.section.delete({ where: { id } });
  }
}

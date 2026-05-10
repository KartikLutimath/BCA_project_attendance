// Users module types
import { Role } from "@prisma/client";

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

export interface UserDetail extends UserListItem {
  updatedAt: Date;
  student: { rollNumber: string; section: { name: string } } | null;
  teacher: { employeeId: string; designation: string } | null;
}

export interface PaginatedUsers {
  users: UserListItem[];
  total: number;
  page: number;
  limit: number;
}

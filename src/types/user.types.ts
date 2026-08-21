import { Role } from "@prisma/client";

export interface CreateUserDTO {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
}
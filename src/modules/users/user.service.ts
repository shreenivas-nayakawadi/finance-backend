import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { Role, UserStatus } from "@prisma/client";

export const listUsers = async (search?: string) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!search) {
    return users;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(search, "i");
  } catch {
    throw new AppError("Invalid regex pattern for search", 400);
  }

  return users.filter(
    (user) =>
      regex.test(user.name) ||
      regex.test(user.email) ||
      regex.test(user.role) ||
      regex.test(user.status),
  );
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateUserRole = async (id: string, role: Role) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  await prisma.user.delete({ where: { id } });
};

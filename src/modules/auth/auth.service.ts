import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { config } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import type { Role } from "@prisma/client";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: Role = "VIEWER",
) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError("Email already in use", 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status === "INACTIVE")
    throw new AppError("Invalid credentials", 401);
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError("Invalid credentials", 401);
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn as
        | `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`
        | number,
    },
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

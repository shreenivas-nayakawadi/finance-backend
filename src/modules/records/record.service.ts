import { prisma } from "../../config/prisma.js";
import { RecordType } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";

export interface RecordFilters {
  search?: string;
  type?: RecordType;
  category?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const getRecords = async (filters: RecordFilters) => {
  const { search, type, category, from, to, page = 1, limit = 20 } = filters;
  const where: any = { isDeleted: false };
  if (type) where.type = type;
  if (category) where.category = { contains: category, mode: "insensitive" };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  if (!search) {
    const [total, records] = await Promise.all([
      prisma.record.count({ where }),
      prisma.record.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        include: { createdBy: { select: { id: true, name: true } } },
      }),
    ]);
    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(search, "i");
  } catch {
    throw new AppError("Invalid regex pattern for search", 400);
  }

  const allRecords = await prisma.record.findMany({
    where,
    orderBy: { date: "desc" },
    include: { createdBy: { select: { id: true, name: true } } },
  });

  const filteredRecords = allRecords.filter(
    (record) =>
      regex.test(record.category) ||
      regex.test(record.type) ||
      regex.test(record.description ?? "") ||
      regex.test(record.createdBy.name),
  );

  const total = filteredRecords.length;
  const records = filteredRecords.slice((page - 1) * limit, page * limit);

  return {
    records,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.record.findFirst({
    where: { id, isDeleted: false },
    include: { createdBy: { select: { id: true, name: true } } },
  });
  if (!record) throw new AppError("Record not found", 404);
  return record;
};

export const createRecord = async (data: any, userId: string) => {
  return prisma.record.create({
    data: { ...data, userId, date: new Date(data.date) },
  });
};

export const updateRecord = async (id: string, data: any) => {
  const record = await prisma.record.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) throw new AppError("Record not found", 404);
  return prisma.record.update({ where: { id }, data });
};

export const softDeleteRecord = async (id: string) => {
  const record = await prisma.record.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) throw new AppError("Record not found", 404);
  return prisma.record.update({ where: { id }, data: { isDeleted: true } });
};

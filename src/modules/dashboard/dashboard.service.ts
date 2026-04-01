import { prisma } from "../../config/prisma.js";

export const getSummary = async () => {
  const [income, expense] = await Promise.all([
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME", isDeleted: false },
    }),
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE", isDeleted: false },
    }),
  ]);

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expense._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

export const getCategoryBreakdown = async () => {
  const breakdown = await prisma.record.groupBy({
    by: ["category", "type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return breakdown.map((item) => ({
    category: item.category,
    type: item.type,
    total: Number(item._sum.amount ?? 0),
  }));
};

export const getMonthlyTrends = async () => {
  const rows = await prisma.$queryRaw<
    Array<{ month: Date; type: string; total: unknown }>
  >`
    SELECT
      DATE_TRUNC('month', "date") AS month,
      "type",
      SUM("amount") AS total
    FROM "Record"
    WHERE "isDeleted" = false
    GROUP BY month, "type"
    ORDER BY month DESC
    LIMIT 24
  `;

  return rows.map((row) => ({
    month: row.month,
    type: row.type,
    total: Number(row.total ?? 0),
  }));
};

export const getRecentActivity = async (limit = 10) => {
  return prisma.record.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

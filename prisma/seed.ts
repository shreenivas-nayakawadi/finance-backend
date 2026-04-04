import { PrismaClient, Role, RecordType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── 1. Create demo users ───────────────────────────────────────
  const passwordHash = await bcrypt.hash("123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@finance.com" },
    update: {},
    create: {
      name: "Shreenivas Admin",
      email: "admin@finance.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@finance.com" },
    update: {},
    create: {
      name: "Priya Analyst",
      email: "analyst@finance.com",
      passwordHash,
      role: Role.ANALYST,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@finance.com" },
    update: {},
    create: {
      name: "Rahul Viewer",
      email: "viewer@finance.com",
      passwordHash,
      role: Role.VIEWER,
    },
  });

  console.log("✅ Users created:");
  console.log(`   ADMIN   → admin@finance.com   (password: 123456)`);
  console.log(`   ANALYST → analyst@finance.com  (password: 123456)`);
  console.log(`   VIEWER  → viewer@finance.com   (password: 123456)\n`);

  // ── 2. Create financial records ─────────────────────────────────
  const records = [
    // Income records
    { amount: 75000, type: RecordType.INCOME, category: "Salary", date: "2026-01-01", description: "January salary credited" },
    { amount: 75000, type: RecordType.INCOME, category: "Salary", date: "2026-02-01", description: "February salary credited" },
    { amount: 75000, type: RecordType.INCOME, category: "Salary", date: "2026-03-01", description: "March salary credited" },
    { amount: 15000, type: RecordType.INCOME, category: "Freelance", date: "2026-01-15", description: "Web development freelance project" },
    { amount: 8000, type: RecordType.INCOME, category: "Freelance", date: "2026-02-20", description: "Logo design project" },
    { amount: 5000, type: RecordType.INCOME, category: "Investment", date: "2026-01-10", description: "Mutual fund dividend" },
    { amount: 12000, type: RecordType.INCOME, category: "Investment", date: "2026-03-15", description: "Stock dividend payout" },
    { amount: 3000, type: RecordType.INCOME, category: "Refund", date: "2026-02-28", description: "Tax refund received" },

    // Expense records
    { amount: 18000, type: RecordType.EXPENSE, category: "Rent", date: "2026-01-05", description: "Monthly apartment rent" },
    { amount: 18000, type: RecordType.EXPENSE, category: "Rent", date: "2026-02-05", description: "Monthly apartment rent" },
    { amount: 18000, type: RecordType.EXPENSE, category: "Rent", date: "2026-03-05", description: "Monthly apartment rent" },
    { amount: 4500, type: RecordType.EXPENSE, category: "Groceries", date: "2026-01-08", description: "Monthly grocery shopping" },
    { amount: 3800, type: RecordType.EXPENSE, category: "Groceries", date: "2026-02-10", description: "Supermarket bill" },
    { amount: 5200, type: RecordType.EXPENSE, category: "Groceries", date: "2026-03-12", description: "Monthly groceries + household" },
    { amount: 2500, type: RecordType.EXPENSE, category: "Utilities", date: "2026-01-20", description: "Electricity + water bill" },
    { amount: 2800, type: RecordType.EXPENSE, category: "Utilities", date: "2026-02-22", description: "Electricity + internet bill" },
    { amount: 2200, type: RecordType.EXPENSE, category: "Utilities", date: "2026-03-18", description: "Electricity + water bill" },
    { amount: 6000, type: RecordType.EXPENSE, category: "Transportation", date: "2026-01-12", description: "Fuel + metro pass" },
    { amount: 1500, type: RecordType.EXPENSE, category: "Entertainment", date: "2026-02-14", description: "Movie + dinner" },
    { amount: 8500, type: RecordType.EXPENSE, category: "Healthcare", date: "2026-03-22", description: "Annual health checkup" },
  ];

  let created = 0;
  for (const record of records) {
    await prisma.record.create({
      data: {
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: new Date(record.date),
        description: record.description,
        userId: admin.id,
      },
    });
    created++;
  }

  console.log(`✅ ${created} financial records created across 8 categories\n`);
  console.log("🎉 Seeding complete! You can now start the server.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

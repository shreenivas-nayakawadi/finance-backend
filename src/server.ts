import app from "./app.js";
import { config } from "./config/env.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();

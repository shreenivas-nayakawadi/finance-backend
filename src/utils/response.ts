import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode = 200,
  message?: string,
) => {
  res.status(statusCode).json({ success: true, message, data });
};

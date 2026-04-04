import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/authenticate.js";
import { AppError } from "../../utils/AppError.js";
import { sendSuccess } from "../../utils/response.js";
import type { RecordType } from "@prisma/client";
import {
  createRecord,
  getRecordById,
  getRecords,
  softDeleteRecord,
  updateRecord,
} from "./record.service.js";
import type { RecordFilters } from "./record.service.js";

export const listRecords = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters: RecordFilters = {
      page: req.query["page"] ? Number(req.query["page"]) : 1,
      limit: req.query["limit"] ? Number(req.query["limit"]) : 20,
    };

    if (req.query["type"]) {
      filters.type = req.query["type"] as RecordType;
    }
    if (req.query["search"]) {
      filters.search = req.query["search"] as string;
    }
    if (req.query["category"]) {
      filters.category = req.query["category"] as string;
    }
    if (req.query["from"]) {
      filters.from = req.query["from"] as string;
    }
    if (req.query["to"]) {
      filters.to = req.query["to"] as string;
    }

    const result = await getRecords(filters);
    sendSuccess(res, result, 200, "Records fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const record = await getRecordById(req.params["id"] as string);
    sendSuccess(res, { record }, 200, "Record fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const createNewRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount, type, category, date, description } = req.body as {
      amount: number;
      type: RecordType;
      category: string;
      date: string;
      description?: string;
    };

    const record = await createRecord(
      { amount, type, category, date, description },
      req.user.userId,
    );

    sendSuccess(res, { record }, 201, "Record created successfully");
  } catch (err) {
    next(err);
  }
};

export const updateExistingRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { amount, type, category, date, description } = req.body as {
      amount?: number;
      type?: RecordType;
      category?: string;
      date?: string;
      description?: string;
    };

    const record = await updateRecord(req.params["id"] as string, {
      amount,
      type,
      category,
      date,
      description,
    });

    sendSuccess(res, { record }, 200, "Record updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await softDeleteRecord(req.params["id"] as string);
    sendSuccess(res, null, 200, "Record deleted successfully");
  } catch (err) {
    next(err);
  }
};

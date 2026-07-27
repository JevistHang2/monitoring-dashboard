import type { ErrorRequestHandler } from "express";
import { sendError } from "../utils/api-response.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  return sendError(res, "Internal server error", 500);
};

import type { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    code: statusCode,
    data,
  } satisfies ApiResponse<T>);
}

export function sendError(res: Response, message: string, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    code: statusCode,
    data: null,
  } satisfies ApiResponse<null>);
}

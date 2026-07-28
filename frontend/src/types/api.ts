export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};

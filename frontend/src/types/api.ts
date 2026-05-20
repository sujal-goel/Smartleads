export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  stack?: string;
}

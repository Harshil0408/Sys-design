export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    total?: number;
  };
}

export function successResponse<T>(data: T, total?: number): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...(total !== undefined ? { total } : {})
    }
  };
}

export function errorResponse(message: string, code = "INTERNAL_SERVER_ERROR"): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  };
}

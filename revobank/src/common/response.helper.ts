import { ApiResponse } from "./interfaces/api-response.interface";

export function successResponse<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
): ApiResponse<T>{
    return {statusCode, message, data}
}
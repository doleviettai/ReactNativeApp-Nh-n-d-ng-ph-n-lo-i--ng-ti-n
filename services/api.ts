// services/api.ts
import axios, { AxiosError } from 'axios';
import { PredictionResult } from '@/types/prediction';

// ⚠️ Đổi thành địa chỉ IP server ML của bạn
const BASE_URL = 'http://192.168.1.16:8000';

// ===== CUSTOM ERROR =====
export class PredictionError extends Error {
  constructor(
    message: string,
    public readonly code: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'INVALID_IMAGE' | 'TIMEOUT' | 'UNKNOWN',
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'PredictionError';
  }
}

// ===== VALIDATE RESPONSE =====
function validatePredictionResult(data: unknown): PredictionResult {
  if (!data || typeof data !== 'object') {
    throw new PredictionError('Phản hồi từ server không hợp lệ', 'SERVER_ERROR');
  }

  const result = data as Record<string, unknown>;

  // Kiểm tra server trả về lỗi dạng { error: "..." }
  if ('error' in result) {
    throw new PredictionError(
      `Server báo lỗi: ${result.error}`,
      'SERVER_ERROR'
    );
  }

  if (typeof result.class !== 'string' || typeof result.confidence !== 'number') {
    throw new PredictionError('Dữ liệu trả về thiếu field "class" hoặc "confidence"', 'SERVER_ERROR');
  }

  return result as unknown as PredictionResult;
}

// ===== MAIN FUNCTION =====
export const predictCurrency = async (imageUri: string): Promise<PredictionResult> => {
  if (!imageUri || typeof imageUri !== 'string') {
    throw new PredictionError('imageUri không hợp lệ', 'INVALID_IMAGE');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'currency.jpg',
  } as any);

  try {
    const response = await axios.post<unknown>(
      `${BASE_URL}/predict`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000,
      }
    );

    return validatePredictionResult(response.data);

  } catch (err) {
    // Nếu đã là PredictionError thì ném thẳng
    if (err instanceof PredictionError) throw err;

    const error = err as AxiosError;

    // Timeout
    if (error.code === 'ECONNABORTED') {
      throw new PredictionError(
        'Server không phản hồi, vui lòng thử lại',
        'TIMEOUT'
      );
    }

    // Không kết nối được (mất mạng, sai IP, server tắt)
    if (!error.response) {
      throw new PredictionError(
        'Không thể kết nối đến server. Kiểm tra WiFi hoặc địa chỉ IP',
        'NETWORK_ERROR'
      );
    }

    // Lỗi HTTP từ server (4xx, 5xx)
    const status = error.response.status;
    const detail =
      (error.response.data as any)?.detail ??
      (error.response.data as any)?.error ??
      'Lỗi không xác định';

    if (status === 400 || status === 415 || status === 413) {
      throw new PredictionError(`Ảnh không hợp lệ: ${detail}`, 'INVALID_IMAGE', status);
    }

    if (status === 503) {
      throw new PredictionError('Server chưa sẵn sàng, thử lại sau', 'SERVER_ERROR', status);
    }

    if (status >= 500) {
      throw new PredictionError(`Lỗi server (${status}): ${detail}`, 'SERVER_ERROR', status);
    }

    throw new PredictionError(`Lỗi không xác định (${status})`, 'UNKNOWN', status);
  }
};

// ===== HELPER: chuyển lỗi thành thông báo thân thiện =====
export function getErrorMessage(err: unknown): string {
  if (err instanceof PredictionError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại';
}
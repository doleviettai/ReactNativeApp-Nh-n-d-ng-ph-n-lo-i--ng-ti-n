// types/prediction.ts
export interface TopPrediction {
  class_name: string;
  confidence: number;
}

// types/prediction.ts
export interface PredictionResult {
  class: string;        // ✅ server trả về "class", không phải "class_name"
  confidence: number;
  authenticity: string;
  currency_type: string;
  top_predictions?: {
    class: string;
    confidence: number;
  }[];
}
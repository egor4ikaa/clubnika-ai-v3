// src/hooks/useMLModels.ts
import { useEffect, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

export type ModelType = 'sort' | 'ripeness' | 'disease';
export interface Prediction {
  className: string;
  probability: number;
}

// Ссылки на модели, полученные из Teachable Machine
// Замените эти URL на свои реальные
const MODEL_URLS: Record<ModelType, string> = {
  sort: 'https://teachablemachine.withgoogle.com/models/72C7F0VKp/',
  ripeness: 'https://teachablemachine.withgoogle.com/models/ВАША_ССЫЛКА_ДЛЯ_ЗРЕЛОСТИ/',
  disease: 'https://teachablemachine.withgoogle.com/models/ВАША_ССЫЛКА_ДЛЯ_БОЛЕЗНИ/',
};

export function useMLModels() {
  const [models, setModels] = useState<Record<ModelType, tmImage.CustomMobileNet | null>>({
    sort: null,
    ripeness: null,
    disease: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const loadedModels: Partial<Record<ModelType, tmImage.CustomMobileNet>> = {};
      for (const type of ['sort', 'ripeness', 'disease'] as ModelType[]) {
        try {
          const model = await tmImage.load(MODEL_URLS[type]);
          loadedModels[type] = model;
        } catch (err) {
          console.error(`Ошибка загрузки модели ${type}:`, err);
        }
      }
      setModels({
        sort: loadedModels.sort || null,
        ripeness: loadedModels.ripeness || null,
        disease: loadedModels.disease || null,
      });
      setLoading(false);
    };
    loadModels();
  }, []);

  const predict = async (type: ModelType, imageElement: HTMLImageElement): Promise<Prediction[]> => {
    const model = models[type];
    if (!model) {
      throw new Error(`Модель ${type} ещё не загружена`);
    }
    const predictions = await model.predict(imageElement);
    // predictions уже имеет тип { className: string; probability: number }[]
    return predictions as Prediction[];
  };

  return { models, loading, predict };
}
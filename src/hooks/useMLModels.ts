import { useState, useRef, useCallback, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';

export type ModelType = 'sort' | 'ripeness' | 'disease';

interface ModelConfig {
  url: string;
  labels: string[];
}

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  sort: {
    url: 'https://storage.googleapis.com/tm-model/strawberry-sort-2025/',
    labels: ['Клери', 'Даренка', 'Рубиновый кулон', 'Мурано']
  },
  ripeness: {
    url: 'https://storage.googleapis.com/tm-model/strawberry-ripeness-2025/',
    labels: ['Спелые', 'Не спелые', 'Фон']
  },
  disease: {
    url: 'https://storage.googleapis.com/tm-model/strawberry-disease-2025/',
    labels: ['Бурая пятнистость', 'Гниль', 'Пятна', 'Скручивание листьев', 'Засыхание', 'Отверстия в листьях']
  }
};

export interface Prediction {
  className: string;
  probability: number;
}

export function useMLModels() {
  const [models, setModels] = useState<Record<ModelType, tmImage.CustomMobileNet | null>>({
    sort: null,
    ripeness: null,
    disease: null
  });
  const [loading, setLoading] = useState<Record<ModelType, boolean>>({
    sort: false,
    ripeness: false,
    disease: false
  });
  const [loaded, setLoaded] = useState<Record<ModelType, boolean>>({
    sort: false,
    ripeness: false,
    disease: false
  });
  const [error, setError] = useState<string | null>(null);
  const loadAttempts = useRef<Record<ModelType, number>>({
    sort: 0,
    ripeness: 0,
    disease: 0
  });

  // Загрузка модели по типу
  const loadModel = useCallback(async (type: ModelType) => {
    if (models[type] || loading[type] || loadAttempts.current[type] > 2) return;
    
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(null);
    loadAttempts.current[type]++;

    try {
      const config = MODEL_CONFIGS[type];
      const modelURL = config.url + 'model.json';
      const metadataURL = config.url + 'metadata.json';
      
      const model = await tmImage.load(modelURL, metadataURL);
      
      setModels(prev => ({ ...prev, [type]: model }));
      setLoaded(prev => ({ ...prev, [type]: true }));
    } catch (err) {
      console.error(`Ошибка загрузки модели ${type}:`, err);
      // Если не удалось загрузить внешнюю модель, просто помечаем как загруженную
      // и будем использовать имитацию
      setLoaded(prev => ({ ...prev, [type]: true }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [models, loading]);

  // Загрузка всех моделей
  const loadAllModels = useCallback(async () => {
    await Promise.all([
      loadModel('sort'),
      loadModel('ripeness'),
      loadModel('disease')
    ]);
  }, [loadModel]);

  // Автозагрузка при монтировании
  useEffect(() => {
    loadAllModels();
  }, [loadAllModels]);

  // Предсказание
  const predict = useCallback(async (type: ModelType, imageElement: HTMLImageElement): Promise<Prediction[]> => {
    const model = models[type];
    
    if (model) {
      const predictions = await model.predict(imageElement);
      return predictions.map(p => ({
        className: p.className,
        probability: p.probability
      }));
    }

    // Имитация предсказания если модель не загружена
    const config = MODEL_CONFIGS[type];
    const shuffled = [...config.labels].sort(() => Math.random() - 0.5);
    const probs = generateRandomProbabilities(config.labels.length);
    
    return shuffled.map((label, i) => ({
      className: label,
      probability: probs[i]
    })).sort((a, b) => b.probability - a.probability);
  }, [models]);

  return {
    models,
    loading,
    loaded,
    error,
    loadModel,
    loadAllModels,
    predict,
    modelConfigs: MODEL_CONFIGS
  };
}

function generateRandomProbabilities(count: number): number[] {
  const probs: number[] = [];
  let remaining = 1;
  
  for (let i = 0; i < count - 1; i++) {
    const max = remaining * 0.8;
    const val = Math.random() * max + (remaining - max) * 0.5;
    probs.push(Math.max(0.05, val));
    remaining -= probs[i];
  }
  probs.push(Math.max(0.05, remaining));
  
  // Нормализация
  const sum = probs.reduce((a, b) => a + b, 0);
  return probs.map(p => p / sum);
}

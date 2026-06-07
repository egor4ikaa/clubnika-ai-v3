import { useState, useRef, useCallback, useEffect } from 'react';
import { useMLModels, type ModelType, type Prediction } from '@/hooks/useMLModels';
import { useImageCapture } from '@/hooks/useImageCapture';
import { 
  Camera, Upload, RefreshCw, X, Loader2, 
  Sprout, ClipboardCheck, Bug, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

type AnalysisMode = 'sort' | 'ripeness' | 'disease';

interface StrawberryData {
  description: string;
  origin: string;
  maturity: string;
  color_and_shape: string;
  farming: string;
}

interface DiseaseData {
  description: string;
  symptoms: string[];
  preparates: string[];
  treatment: string;
  prevention: string;
}

const modeConfig: Record<AnalysisMode, { label: string; icon: typeof Sprout; analyzeText: string }> = {
  sort: { label: 'Сорт клубники', icon: Sprout, analyzeText: 'Определить сорт' },
  ripeness: { label: 'Зрелость ягод', icon: ClipboardCheck, analyzeText: 'Проверить зрелость' },
  disease: { label: 'Болезнь', icon: Bug, analyzeText: 'Диагностировать' }
};

export function ClassifierPage() {
  const [mode, setMode] = useState<AnalysisMode>('sort');
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [strawberryData, setStrawberryData] = useState<Record<string, StrawberryData>>({});
  const [diseaseData, setDiseaseData] = useState<Record<string, DiseaseData>>({});
  const { predict } = useMLModels();
  const { image, isCapturing, startCamera, captureImage, stopCamera, uploadImage, clearImage } = useImageCapture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Загрузка данных
  useEffect(() => {
    Promise.all([
      fetch('/data/strawberry_data.json').then(r => r.json()).catch(() => ({})),
      fetch('/data/disease_data.json').then(r => r.json()).catch(() => ({}))
    ]).then(([sData, dData]) => {
      setStrawberryData(sData);
      setDiseaseData(dData);
    });
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
      setPredictions(null);
    }
  }, [uploadImage]);

  const handleStartCamera = useCallback(async () => {
    clearImage();
    setPredictions(null);
    await startCamera(videoRef.current || undefined);
  }, [startCamera, clearImage]);

  const handleCapture = useCallback(() => {
    captureImage();
  }, [captureImage]);

  const handleAnalyze = useCallback(async () => {
    if (!image || !imageRef.current) return;
    
    setAnalyzing(true);
    try {
      // Даём время изображению загрузиться
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        const results = await predict(mode as ModelType, imageRef.current);
        setPredictions(results);
      } else {
        // Ждём загрузки изображения
        imageRef.current.onload = async () => {
          if (imageRef.current) {
            const results = await predict(mode as ModelType, imageRef.current);
            setPredictions(results);
          }
        };
      }
    } catch (err) {
      console.error('Ошибка анализа:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [image, mode, predict]);

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    setPredictions(null);
  };

  const handleClear = () => {
    clearImage();
    setPredictions(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const topPrediction = predictions?.[0];
  const currentData = topPrediction && mode === 'sort' ? strawberryData[topPrediction.className] : null;
  const currentDisease = topPrediction && mode === 'disease' ? diseaseData[topPrediction.className] : null;
  const currentRipeness = topPrediction && mode === 'ripeness' ? topPrediction : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Определитель сортов и болезней</h1>
            <p className="text-sm text-gray-500">Загрузите фото клубники для анализа</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(Object.entries(modeConfig) as [AnalysisMode, typeof modeConfig.sort][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                mode === key
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              <config.icon className="w-5 h-5" />
              {config.label}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          {!image && !isCapturing && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Camera className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Загрузите фото клубники
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Сделайте чёткое фото ягоды или листьев при хорошем освещении для точного определения
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all hover:scale-105"
                >
                  <Upload className="w-5 h-5" />
                  Загрузить фото
                </button>
                <button
                  onClick={handleStartCamera}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 hover:border-green-300 hover:text-green-600 font-medium rounded-xl transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Снять сейчас
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Camera View */}
          {isCapturing && (
            <div className="text-center">
              <div className="relative max-w-lg mx-auto rounded-xl overflow-hidden bg-black mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCapture}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Сделать снимок
                </button>
                <button
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {image && (
            <div className="text-center">
              <div className="relative max-w-lg mx-auto rounded-xl overflow-hidden mb-4">
                <img
                  ref={imageRef}
                  src={image}
                  alt="Preview"
                  className="w-full aspect-[4/3] object-cover"
                  crossOrigin="anonymous"
                />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:scale-100 text-white font-medium rounded-xl transition-all hover:scale-105"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Анализируем...
                    </>
                  ) : (
                    <>
                      {(() => {
                        const IconComponent = modeConfig[mode].icon;
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                      {modeConfig[mode].analyzeText}
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Новое фото
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {predictions && topPrediction && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Predictions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Результаты анализа
              </h3>
              <div className="space-y-3">
                {predictions.slice(0, 3).map((pred, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-900">{pred.className}</span>
                        <span className="font-bold text-green-600">{(pred.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            i === 0 ? 'bg-green-500' : i === 1 ? 'bg-green-400' : 'bg-green-300'
                          }`}
                          style={{ width: `${pred.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort Details */}
            {mode === 'sort' && currentData && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  О сорте «{topPrediction.className}»
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <span className="font-semibold text-gray-700">Описание:</span>
                    <p className="text-gray-600 mt-1">{currentData.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700">Происхождение:</span>
                      <p className="text-gray-600 mt-1">{currentData.origin}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700">Срок созревания:</span>
                      <p className="text-gray-600 mt-1">{currentData.maturity}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700">Цвет и форма:</span>
                    <p className="text-gray-600 mt-1">{currentData.color_and_shape}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="font-semibold text-amber-800">Выращивание:</span>
                    <p className="text-amber-700 mt-1">{currentData.farming}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Disease Details */}
            {mode === 'disease' && currentDisease && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-500" />
                  Диагноз: {topPrediction.className}
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <span className="font-semibold text-red-800">Описание:</span>
                    <p className="text-red-700 mt-1">{currentDisease.description}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700">Симптомы:</span>
                    <ul className="mt-2 space-y-1">
                      {currentDisease.symptoms.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="font-semibold text-blue-800">Рекомендуемые препараты:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentDisease.preparates.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <span className="font-semibold text-green-800">Методы лечения:</span>
                    <p className="text-green-700 mt-1">{currentDisease.treatment}</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="font-semibold text-amber-800">Профилактика:</span>
                    <p className="text-amber-700 mt-1">{currentDisease.prevention}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ripeness Details */}
            {mode === 'ripeness' && currentRipeness && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-green-500" />
                  Анализ зрелости
                </h3>
                <div className="p-6 bg-green-50 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {(currentRipeness.probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-lg text-green-600">
                    {currentRipeness.className === 'Спелые' 
                      ? 'Ягоды спелые, можно собирать!' 
                      : currentRipeness.className === 'Не спелые'
                      ? 'Ягоды ещё не дозрели'
                      : 'Не удалось определить зрелость'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';

export function useImageCapture() {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (videoElement?: HTMLVideoElement) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      
      if (videoElement) {
        videoElement.srcObject = stream;
        videoRef.current = videoElement;
      }
      setIsCapturing(true);
    } catch (err: any) {
      let msg = 'Не удалось получить доступ к камере.\n\n';
      if (err.name === 'NotAllowedError') {
        msg += 'Разрешите доступ к камере в настройках браузера.';
      } else if (err.name === 'NotFoundError') {
        msg += 'Камера не найдена.';
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        msg += 'Камера работает только на HTTPS или localhost.';
      } else {
        msg += 'Проверьте подключение камеры и разрешения.';
      }
      setError(msg);
      setIsCapturing(false);
    }
  }, []);

  const captureImage = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImage(dataUrl);
    stopCamera();
    return dataUrl;
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  const uploadImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.match('image.*')) {
        reject(new Error('Пожалуйста, выберите файл изображения'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(file);
    });
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
    stopCamera();
  }, [stopCamera]);

  return {
    image,
    isCapturing,
    error,
    startCamera,
    captureImage,
    stopCamera,
    uploadImage,
    clearImage,
    videoRef
  };
}

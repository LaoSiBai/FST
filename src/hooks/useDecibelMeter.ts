import { useState, useEffect, useRef } from 'react';

export function useDecibelMeter(isActive: boolean) {
  const [dbCurrent, setDbCurrent] = useState<number>(0);
  const [dbAvg, setDbAvg] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const dbMeasurements = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);

  function stopMeter() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      const tracks = sourceRef.current.mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      sourceRef.current = null;
    }
  }

  useEffect(() => {
    if (!isActive) {
      stopMeter();
      return;
    }

    let isMounted = true;

    async function startMeter() {
      try {
        if (!audioContextRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 2048;
        sourceRef.current.connect(analyser);

        const dataArray = new Float32Array(analyser.fftSize);
        dbMeasurements.current = [];
        startTimeRef.current = Date.now();
        setDbCurrent(0);
        setDbAvg(0);
        setElapsedTime("00:00");
        setError(null);

        intervalRef.current = window.setInterval(() => {
          analyser.getFloatTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          let db = 0;
          if (rms > 0) {
            db = 20 * Math.log10(rms) + 100;
            db = Math.max(0, Math.min(120, db));
          }

          const dbValue = Math.round(db);
          setDbCurrent(dbValue);

          dbMeasurements.current.push(dbValue);
          if (dbMeasurements.current.length > 100) {
            dbMeasurements.current.shift();
          }
          const avgSum = dbMeasurements.current.reduce((a, b) => a + b, 0);
          setDbAvg(Math.round(avgSum / dbMeasurements.current.length));

          const elapsedMs = Date.now() - startTimeRef.current;
          const elapsedSec = Math.floor(elapsedMs / 1000);
          const m = Math.floor(elapsedSec / 60).toString().padStart(2, '0');
          const s = (elapsedSec % 60).toString().padStart(2, '0');
          setElapsedTime(`${m}:${s}`);
        }, 200);

      } catch {
        if (isMounted) {
          setError("无法访问麦克风，请检查浏览器权限设置。");
        }
      }
    }

    startMeter();

    return () => {
      isMounted = false;
      stopMeter();
    };
  }, [isActive]);

  return { dbCurrent, dbAvg, elapsedTime, error };
}

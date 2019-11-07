import { useState, useEffect } from 'react';
import { PlayerConfigInterface } from '../types';
export const visEffect = (
  canvas: HTMLCanvasElement,
  audioCtx: AudioContext,
  audioInput: MediaStreamAudioSourceNode | MediaElementAudioSourceNode,
  {
    enabled,
    lineWidth,
    lineColor,
  }: { enabled: boolean; lineWidth?: number; lineColor?: string },
  player: boolean
) => {
  if (!enabled) return;
  let context = canvas.getContext('2d');
  if (!context) return;
  let reqId: number;
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  if (player) {
    analyser.connect(audioCtx.destination);
  }
  audioInput.connect(analyser);
  const render = () => {
    if (!context || !(canvas && canvas)) return;
    // get the canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // clear the canvas
    const grad = context.createLinearGradient(0, 100, 200, 100);

    grad.addColorStop(0, 'rgba(99,8,145,1)');
    grad.addColorStop(1, 'rgba(28,5,97,1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, width, height);
    context.lineWidth = lineWidth || 3;
    context.strokeStyle = lineColor || '#E3AE0C';

    context.beginPath();
    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;
    analyser.getByteTimeDomainData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * height) / 2;

      i == 0 ? context.moveTo(x, y) : context.lineTo(x, y);
      x += sliceWidth;
    }

    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
    reqId = requestAnimationFrame(render);
  };
  // context.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
  return () => {
    if (!context || !canvas) return;
    const grad = context.createLinearGradient(0, 100, 200, 100);
    grad.addColorStop(0, 'rgba(99,8,145,1)');
    grad.addColorStop(1, 'rgba(28,5,97,1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(reqId);
  };
};
export function useAudioPlayer(config: PlayerConfigInterface) {
  const {
    audioFile,
    canvas,
    container,
    handleStartPlaying,
    handlePlaying,
    handleFinishPlaying,
  } = config;
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [
    audioSrcNode,
    setAudioSrcNode,
  ] = useState<MediaElementAudioSourceNode | null>(null);
  const [duration, setDuration] = useState();
  const [clickedTime, setClickedTime] = useState();
  const [curTime, setCurTime] = useState();
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    if (!audio) return;
    setPlaying(true);
    audio.play();
    handleStartPlaying && handleStartPlaying();
  };

  const pause = () => {
    if (!audio) return;
    setPlaying(false);
    audio.pause();
  };

  const togglePlaying = () => {
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      if (!audio.ended && audio.readyState > 2) {
        pause();
      }
    }
  };

  useEffect(() => {
    if (!audio) return;
    // state setters wrappers
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
    };

    const setAudioTime = () => {
      setCurTime(audio.currentTime);
      handlePlaying && handlePlaying(audio.currentTime);
    };

    // DOM listeners: update React state on DOM events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('ended', () => {
      setPlaying(false);
      handleFinishPlaying && handleFinishPlaying();
    });
    audio.addEventListener('timeupdate', setAudioTime);

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime;
      setClickedTime(null);
    }
    // effect cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('ended', () => {
        setPlaying(false);
        handleFinishPlaying && handleFinishPlaying();
      });
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  });

  useEffect(() => {
    const newSrc = URL.createObjectURL(audioFile.file);
    setSrc(newSrc);
    setPlaying(false);
    return () => {
      URL.revokeObjectURL(newSrc);
    };
  }, [audioFile]);

  useEffect(() => {
    if (!src) return;
    const newAudio = new Audio(src);
    setAudio(newAudio);
    // if (!container) return;
    // container.append(newAudio);
  }, [src]);

  useEffect(() => {
    if (!audio) return;
    const newContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioCtx(newContext);
    return () => {
      if (audioCtx && audioCtx.state !== 'closed') {
        try {
          audioCtx.close();
          setAudioCtx(null);
        } catch (error) {
          console.log(error);
        }
      }
    };
  }, [audio]);

  useEffect(() => {
    if (!audio || !audioCtx) return;
    const newSource = audioCtx.createMediaElementSource(audio);
    setAudioSrcNode(newSource);
  }, [audioCtx]);

  useEffect(() => {
    if (!canvas || !audio || !audioCtx || !audioSrcNode) return;
    visEffect(canvas, audioCtx, audioSrcNode, config.visualizer, true);
  });

  return {
    curTime,
    duration,
    playing,
    togglePlaying,
    setClickedTime,
  };
}

export default useAudioPlayer;

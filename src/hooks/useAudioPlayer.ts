import { useState, useEffect } from 'react';
import { PlayerConfigInterface } from '../types';
import { visualization } from '../utils/helpers';
export function useAudioPlayer(config: PlayerConfigInterface) {
  const {
    audioFile,
    canvas,
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
      if (audioSrcNode && (audioCtx && audioCtx.state !== 'closed')) {
        try {
          console.log('trying');
          audioSrcNode.disconnect();
          setAudioSrcNode(null);
          audioCtx.close();
          setAudioCtx(null);
        } catch (error) {
          console.log(error);
        }
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (!src) return;
    const newAudio = new Audio(src);
    setAudio(newAudio);
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
    return () => {
      if (
        audioSrcNode &&
        audioSrcNode.context &&
        audioSrcNode.context.state === 'closed'
      ) {
        audioSrcNode && audioSrcNode.disconnect();
      }
    };
  }, [audioCtx]);

  useEffect(() => {
    if (!canvas || !audio || !audioCtx || !audioSrcNode) return;

    visualization(canvas, audioCtx, audioSrcNode, config.visualizer, true);
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

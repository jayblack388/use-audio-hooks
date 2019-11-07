import React, { FC, useRef } from 'react';

import { AudioPlayerProps, PlayerConfigInterface } from '../../../types';
import { useAudioPlayer } from '../../../hooks';
import { Play, Pause } from '../../Icons';
import * as S from './Audio.styled';

const formatSecs = (seconds: number) => {
  const rdDwnSeconds = Math.floor(seconds);
  if (rdDwnSeconds < 10) {
    return `0:0${rdDwnSeconds}`;
  } else {
    return `0:${rdDwnSeconds}`;
  }
};

const PlayPauseIcon = ({ playing }: { playing: boolean }) =>
  playing ? <Pause height="2.8rem" /> : <Play height="2.8rem" />;

export const AudioPlayer: FC<AudioPlayerProps> = ({ audioFile, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config: PlayerConfigInterface = {
    audioFile,
    canvas: canvasRef && canvasRef.current,
    container: containerRef && containerRef.current,
    handleStartPlaying: () => console.log('starting'),
    handlePlaying: seconds => console.log('playing => ', seconds),
    handleFinishPlaying: () => console.log('stopping'),
    visualizer: { enabled: true, lineWidth: 5 },
  };
  const {
    curTime,
    duration,
    playing,
    togglePlaying,
    // setClickedTime,
  } = useAudioPlayer({
    ...config,
    ...props.config,
  });
  return (
    <S.PlayerRecorderContainer>
      <S.VisualizerContainer>
        <S.RecordButton
          onClick={e => {
            e.preventDefault();
            togglePlaying();
          }}
        >
          {/* <i className="icon-mic-on" /> */}
          <PlayPauseIcon playing={playing} />
        </S.RecordButton>
        <S.Visualizer ref={canvasRef} />
      </S.VisualizerContainer>
      {/* <S.Audio ref={audioRef} /> */}
      <S.Duration>
        {!duration
          ? '0:00 / 0:00'
          : `${formatSecs(curTime)} / ${formatSecs(duration)}`}
      </S.Duration>
    </S.PlayerRecorderContainer>
  );
};

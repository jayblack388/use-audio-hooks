import React, { FC, useRef } from 'react';
import { AudioRecorderProps, RecorderConfigInterface } from '../../../types';
import { useAudioRecorder } from '../../../hooks';
import { Microphone } from '../../Icons';
import * as S from './Audio.styled';

const formatMilis = (miliseconds: number) => {
  const rdDwnSeconds = Math.floor(miliseconds / 1000);
  if (rdDwnSeconds < 10) {
    return `0:0${rdDwnSeconds}`;
  } else {
    return `0:${rdDwnSeconds}`;
  }
};

export const AudioRecorder: FC<AudioRecorderProps> = ({
  setFiles,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config: RecorderConfigInterface = {
    canvas: canvasRef && canvasRef.current,
    handleStartRecording: () => console.log('starting'),
    handleFinishRecording: () => console.log('stopping'),
    handleRecording: (miliseconds) => console.log('recording => ', miliseconds),
    setFiles,
    visualizer: { enabled: true, lineWidth: 5 },
  };
  const { duration, toggleRecording, recording } = useAudioRecorder({
    ...config,
    ...props.config,
  });
  return (
    <S.PlayerRecorderContainer>
      <S.VisualizerContainer>
        <S.RecordButton
          onClick={e => {
            e.preventDefault();
            toggleRecording();
          }}
        >
          <Microphone height="2.8rem" />
        </S.RecordButton>
        <S.Visualizer ref={canvasRef} />
      </S.VisualizerContainer>
      <S.Duration id="duration">
        {duration === 0 || !recording ? '0:00' : formatMilis(duration)}
      </S.Duration>
    </S.PlayerRecorderContainer>
  );
};

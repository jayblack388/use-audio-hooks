# Use Audio Hooks

```
yarn add use-audio-hooks
// or
npm install use-audio-hooks
```

[![Netlify Status](https://api.netlify.com/api/v1/badges/d89ca227-5b23-4ca5-9c92-f69636aec318/deploy-status)](https://app.netlify.com/sites/use-audio-demo/deploys)

This package expose `useAudioPlayer` and `useAudioRecorder`, as well as several components: `Audio`, `AudioRecorder`, and `AudioPlayer` that use those hooks, as well as the underlying styled components that compose those components.

## useAudioPlayer

```
function useAudioPlayer(config: PlayerConfigInterface) {
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
```

## useAudioRecorder

```
function useAudioRecorder(config: RecorderConfigInterface) {
  const {
    canvas,
    handleStartRecording,
    handleRecording,
    setFiles,
    handleFinishRecording,
  } = config;
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [
    audioInput,
    setAudioInput,
  ] = useState<MediaStreamAudioSourceNode | null>(null);
  const [audioNode, setAudioNode] = useState<ScriptProcessorNode | null>(null);
  const [bufferSize /* setBufferSize */] = useState(4096);
  const [, /* blob */ setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [microphone, setMicrophone] = useState<MediaStream | null>(null);
  const [recordedData, setRecordedData] = useState<Float32Array[]>([]);
  const [recording, setRecording] = useState(false);
  const [recordingLength, setRecordingLength] = useState(0);
  const [sampleRate, setSampleRate] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const toggleRecording = () => {
    recording ? stop() : start();
  };
  const processInWebWorker = (_function: any) => {
    const workerURL = URL.createObjectURL(
      new Blob(
        [
          _function.toString(),
          `;this.onmessage = function(e) {${_function.name}(e.data);}`,
        ],
        {
          type: 'application/javascript',
        }
      )
    );

    const worker = new Worker(workerURL) as WorkerWithUrl;
    worker.workerURL = workerURL;
    return worker;
  };
  function exportWav(config: any, callback: any) {
    function inlineWebWorker(config: any, cb: any) {
      function joinBuffers(channelBuffer: any, count: any) {
        const result = new Float64Array(count);
        let offset = 0;
        const lng = channelBuffer.length;

        for (let i = 0; i < lng; i++) {
          const buffer = channelBuffer[i];
          result.set(buffer, offset);
          offset += buffer.length;
        }

        return result;
      }
      function writeUTFBytes(view: any, offset: any, string: string) {
        const lng = string.length;
        for (let i = 0; i < lng; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }
      const firstData = config.data.slice(0);
      const data = joinBuffers(firstData, config.recordingLength);

      const dataLength = data.length;

      // create wav file
      const buffer = new ArrayBuffer(44 + dataLength * 2);
      const view = new DataView(buffer);

      writeUTFBytes(view, 0, 'RIFF'); // RIFF chunk descriptor/identifier
      view.setUint32(4, 44 + dataLength * 2, true); // RIFF chunk length
      writeUTFBytes(view, 8, 'WAVE'); // RIFF type
      writeUTFBytes(view, 12, 'fmt '); // format chunk identifier, FMT sub-chunk
      view.setUint32(16, 16, true); // format chunk length
      view.setUint16(20, 1, true); // sample format (raw)
      view.setUint16(22, 1, true); // mono (1 channel)
      view.setUint32(24, config.sampleRate, true); // sample rate
      view.setUint32(28, config.sampleRate * 2, true); // byte rate (sample rate * block align)
      view.setUint16(32, 2, true); // block align (channel count * bytes per sample)
      view.setUint16(34, 16, true); // bits per sample
      writeUTFBytes(view, 36, 'data'); // data sub-chunk identifier
      view.setUint32(40, dataLength * 2, true); // data chunk length

      // write the PCM samples
      let index = 44;
      for (let i = 0; i < dataLength; i++) {
        view.setInt16(index, data[i] * 0x7fff, true);
        index += 2;
      }

      if (cb) {
        return cb({
          buffer: buffer,
          view: view,
        });
      }
      self.postMessage({
        buffer: buffer,
        view: view,
      });
    }
    const webWorker = processInWebWorker(inlineWebWorker);

    webWorker.onmessage = function messageFn(event) {
      callback(event.data.buffer, event.data.view);

      // release memory
      URL.revokeObjectURL(webWorker.workerURL);
    };

    webWorker.postMessage(config);
  }
  const stopRecording = (callback: (blob: Blob) => void) => {
    setRecording(false);

    if (!audioInput || !audioNode || !audioCtx || !microphone) return;
    microphone.getTracks().forEach(t => t.stop());
    audioInput.disconnect();
    audioNode.disconnect();
    audioCtx.close();
    setMicrophone(null);
    setAudioInput(null);
    setAudioCtx(null);
    setAudioNode(null);
    setStartDate(null);
    setSampleRate(null);
    exportWav(
      {
        sampleRate,
        recordingLength,
        data: recordedData,
      },
      function totallyNecessaryName(buffer: Buffer, view: DataView) {
        console.log(buffer);
        const newBlob = new Blob([view], { type: 'audio/wav' });
        setBlob(newBlob);
        callback && callback(newBlob);
      }
    );
  };
  const onAudioProcess = (e: AudioProcessingEvent) => {
    if (!recording) {
      return;
    }
    const float = new Float32Array(e.inputBuffer.getChannelData(0));
    const newDuration =
      new Date().getTime() - ((startDate && startDate.getTime()) || 0);
    setRecordedData(prev => [...prev, float]);
    setRecordingLength(prev => prev + bufferSize);
    setDuration(newDuration);
    handleRecording && handleRecording(newDuration);
  };
  const onMicrophoneError = (e: Error) => {
    console.log(e);
  };
  const onMicrophoneCaptured = (microphone: MediaStream) => {
    setRecording(true);
    if (audioCtx) {
      const newAudioInput = audioCtx.createMediaStreamSource(microphone);
      const newDate = new Date();
      const audioCtxSampleRate = audioCtx.sampleRate;
      setMicrophone(microphone);
      setAudioInput(newAudioInput);
      setStartDate(newDate);
      setSampleRate(audioCtxSampleRate);
    }
  };
  useEffect(() => {
    if (!canvas || !audioCtx || !audioInput) return;
    visualization(canvas, audioCtx, audioInput, config.visualizer, false);
  });
  useEffect(() => {
    if (duration > 30000) {
      stop();
    }
  }, [duration]);

  useEffect(() => {
    if (audioInput && audioNode && audioCtx && startDate) {
      audioInput.connect(audioNode);
      audioNode.addEventListener('audioprocess', onAudioProcess);
    }
    return () => {
      audioNode &&
        audioNode.removeEventListener('audioprocess', onAudioProcess);
    };
  }, [audioInput, startDate]);
  useEffect(() => {
    if (audioNode && (audioCtx && audioCtx.state !== 'closed')) {
      audioNode.connect(audioCtx.destination);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(onMicrophoneCaptured)
        .catch(onMicrophoneError);
    }
    return () => {
      if (audioNode && audioCtx && audioCtx.state === 'closed') {
        audioNode.disconnect();
        setAudioNode(null);
      }
    };
  }, [audioNode]);
  useEffect(() => {
    if (audioCtx && audioCtx.createScriptProcessor) {
      const newNode: ScriptProcessorNode = audioCtx.createScriptProcessor(
        bufferSize,
        1,
        1
      ) as ScriptProcessorNode;
      setAudioNode(newNode);
    } else if (!audioCtx) {
      console.log('awaiting context');
    } else {
      const error = { message: 'WebAudio not supported!' };
      console.log(error);
    }

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
  }, [audioCtx]);

  const start = () => {
    const AudioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioCtx(AudioContext);
    setRecordedData([]);
    setRecordingLength(0);
    handleStartRecording && handleStartRecording();
  };
  const stop = () => {
    stopRecording(newBlob => {
      setBlob(newBlob);
      const fileId = Date.now();
      const newFile = new File([newBlob], `file-${fileId}.mp3`, {
        type: 'audio/mp3',
      });
      const newFileWithId = { id: fileId, file: newFile };
      setFiles(prevState => [newFileWithId, ...prevState]);
      handleFinishRecording && handleFinishRecording(newBlob);
      setDuration(0);
    });
  };

  return { duration, toggleRecording, recording };
}
```

## Audio Component Example

```
const Audio: FC<AudioProps> = props => {
  const [files, setFiles] = useState<FileInterface[]>([]);
  const [audioFile, setAudioFile] = useState<FileInterface | null>(null);
  const submitField = (values: { [key: string]: string }) => {
    const key = Object.keys(values)[0];
    const id = parseInt(key.split('audio_input_')[1]);
    const fileToUpdate = files.filter(file => file.id === id && file)[0];
    Object.defineProperty(fileToUpdate.file, 'name', {
      writable: true,
      value: values[key],
    });
  };
  const handleDelete = (id: number) => {
    if (audioFile && audioFile.id === id) setAudioFile(null);
    setFiles(prevState => prevState.filter(file => file.id !== id && file));
    props.handleDelete && props.handleDelete(id);
  };
  const handleSelect = (id: number) => {
    if (id === (audioFile && audioFile.id)) return setAudioFile(null);
    const newAudioFile = files.filter(file => file.id === id)[0];
    setAudioFile(newAudioFile);
    props.handleSelect && props.handleSelect(id);
  };
  const handleUpload = (id?: number) => {
    if (!props.handleUpload) return;
    const uploadedFile = props.handleUpload();
    if (id) {
      const newFiles = files.filter(file => file.id !== id && file);
      setFiles([uploadedFile, ...newFiles]);
      setAudioFile(uploadedFile);
    } else {
      setFiles(prevState => [uploadedFile, ...prevState]);
      setAudioFile(uploadedFile);
    }
  };
  return (
    <S.AudioContainer>
      {audioFile ? (
        <AudioPlayer config={props.playerConfig} audioFile={audioFile} />
      ) : (
        <AudioRecorder config={props.recorderConfig} setFiles={setFiles} />
      )}
      {props.handleUpload && (
        <S.IconButton
          onClick={e => {
            e.preventDefault();
            handleUpload();
          }}
        >
          <Upload />
        </S.IconButton>
      )}
      {files.length > 0 && (
        <FileList
          files={files}
          handleDelete={handleDelete}
          handleSelect={handleSelect}
          handleUpload={handleUpload}
          selectedFile={audioFile && audioFile.id}
          submitField={submitField}
        />
      )}
    </S.AudioContainer>
  );
};
```

## AudioPlayer Component Example

```
const AudioPlayer: FC<AudioPlayerProps> = ({ audioFile, ...props }) => {
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
          <PlayPauseIcon playing={playing} />
        </S.RecordButton>
        <S.Visualizer ref={canvasRef} />
      </S.VisualizerContainer>
      <S.Duration>
        {!duration
          ? '0:00 / 0:00'
          : `${formatSecs(curTime)} / ${formatSecs(duration)}`}
      </S.Duration>
    </S.PlayerRecorderContainer>
  );
};
```

## AudioRecorder Component Example

```
const AudioRecorder: FC<AudioRecorderProps> = ({
  setFiles,
  ...props
}) => {
  if (!props) return <div />;
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
```

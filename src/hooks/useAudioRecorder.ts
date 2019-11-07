import { useEffect, useState } from 'react';
import { visEffect } from './useAudioPlayer';
import { RecorderConfigInterface } from '../types';

interface WorkerWithUrl extends Worker {
  workerURL: string;
}

export const useAudioRecorder = (config: RecorderConfigInterface) => {
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
  const [bufferSize, setBufferSize] = useState(4096);
  const [blob, setBlob] = useState<Blob | null>(null);
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
          ';this.onmessage = function (e) {' + _function.name + '(e.data);}',
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
  const exportWav = (config: any, callback: any) => {
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
      let data = config.data.slice(0);
      data = joinBuffers(data, config.recordingLength);

      function writeUTFBytes(view: any, offset: any, string: string) {
        const lng = string.length;
        for (let i = 0; i < lng; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

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
      var index = 44;
      for (var i = 0; i < dataLength; i++) {
        view.setInt16(index, data[i] * 0x7fff, true);
        index += 2;
      }

      if (cb) {
        /* eslint-disable-next-line */
        return cb({
          buffer: buffer,
          view: view,
        });
      }

      ((self as unknown) as WorkerWithUrl).postMessage({
        buffer: buffer,
        view: view,
      });
    }

    const webWorker = processInWebWorker(inlineWebWorker);

    webWorker.onmessage = function(event) {
      callback(event.data.buffer, event.data.view);

      // release memory
      URL.revokeObjectURL(webWorker.workerURL);
    };
    webWorker.postMessage(config);
  };
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
      function(buffer: Buffer, view: DataView) {
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
    visEffect(canvas, audioCtx, audioInput, config.visualizer, false);
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
    if (audioNode && audioCtx) {
      audioNode.connect(audioCtx.destination);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(onMicrophoneCaptured)
        .catch(onMicrophoneError);
    }
    return () => {
      if (audioNode) {
        audioNode.disconnect();
        setAudioNode(null);
      }
    };
  }, [audioNode]);
  useEffect(() => {
    // if (!audioCtx) {
    //   initRecorder();
    // }
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
};

import React, { FC, useState } from 'react';

import { AudioProps, FileInterface } from '../../../types';
import { Upload } from '../../Icons';
import * as S from './Audio.styled';
import { AudioRecorder } from './AudioRecorder';
import { AudioPlayer } from './AudioPlayer';
import { FileList } from './FileList';

export const Audio: FC<AudioProps> = props => {
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

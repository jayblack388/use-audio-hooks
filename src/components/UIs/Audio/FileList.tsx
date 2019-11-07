import React, { FC, useState } from 'react';

import {
  FileListItemProps,
  FileInterface,
  FileListProps,
} from '../../../types';
import { Close, Check, Upload } from '../../Icons';
import { Form, Field } from '../../Forms';
import * as S from './Audio.styled';

const FileListField: FC<FileListItemProps> = props => (
  <Form
    autoComplete="off"
    defaultValues={{}}
    onBlur={props.submitField}
    onSubmit={props.submitField}
  >
    <Field
      defaultValue={props.file.file.name}
      fieldName={`audio_input_${props.file.id}`}
      placeholder={props.file.file.name}
      type="text"
      label={false}
    />
  </Form>
);

const FileListItem: FC<FileListItemProps> = ({
  file,
  handleDelete = () => {},
  handleSelect = () => {},
  handleUpload = () => {},
  selected,
  submitField,
}) => {
  const [editing, setEditing] = useState(false);
  const editAndClose = (values: { [key: string]: string }) => {
    submitField(values);
    setEditing(false);
  };
  return (
    <S.FileListItemContainer>
      <S.IconContainer selected={selected}>
        <S.IconButton
          onClick={e => {
            e.preventDefault();
            handleSelect(file.id);
          }}
        >
          <S.CheckBox checked={selected}>
            {selected && <Check color="#fff" height="1.5rem" />}
          </S.CheckBox>
        </S.IconButton>
        {selected && (
          <S.IconButton
            onClick={e => {
              e.preventDefault();
              handleUpload(file.id);
            }}
          >
            <Upload />
          </S.IconButton>
        )}
      </S.IconContainer>
      {editing ? (
        <FileListField
          selected={selected}
          submitField={editAndClose}
          file={file}
        />
      ) : (
        <S.FileListItem
          onClick={e => {
            e.preventDefault();
            setEditing(true);
          }}
        >
          {file.file.name}
        </S.FileListItem>
      )}
      <S.IconButton
        onClick={e => {
          e.preventDefault();
          handleDelete(file.id);
        }}
      >
        <Close />
      </S.IconButton>
    </S.FileListItemContainer>
  );
};

export const FileList: FC<FileListProps> = ({
  files,
  handleDelete,
  handleSelect,
  handleUpload,
  selectedFile,
  submitField,
}) => {
  return (
    <S.FilesList>
      {files.map((file: FileInterface) => (
        <FileListItem
          key={file.id}
          file={file}
          handleDelete={handleDelete}
          handleSelect={handleSelect}
          handleUpload={handleUpload}
          selected={selectedFile === file.id}
          submitField={submitField}
        />
      ))}
    </S.FilesList>
  );
};

import { DefaultTheme } from 'styled-components';
import { FileInterface } from './forms';

export type justifyTypes =
  | 'center'
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'left'
  | 'right'
  | 'normal'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch'
  | 'inherit'
  | 'initial'
  | 'unset';

export type alignTypes =
  | 'normal'
  | 'stretch'
  | 'center'
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'baseline'
  | 'inherit'
  | 'initial'
  | 'unset';

export type AccordionProps = {
  open: boolean;
  toggle?: () => void;
  theme?: DefaultTheme;
  containerColor?: Colors;
  contentColor?: Colors;
} & AdjustableDimensions;

export interface AdjustableDimensions {
  height?: string;
  minH?: string;
  maxH?: string;
  width?: string;
  minW?: string;
  maxW?: string;
}

export type AudioPlayerContainerProps = {
  loaded: boolean;
};

export type AudioPlayerProps = {
  audioFile: FileInterface;
  config?: PlayerConfigInterface;
};

export type AudioProps = {
  handleDelete?: (id: number) => void;
  handleSelect?: (id: number) => void;
  handleUpload?: () => FileInterface;
  playerConfig?: PlayerConfigInterface;
  recorderConfig?: RecorderConfigInterface;
};

export type AudioRecorderProps = {
  // isLoading: boolean;
  config?: RecorderConfigInterface;
  setFiles: (value: React.SetStateAction<FileInterface[]>) => void;
};

export interface Margins {
  m?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
}

export interface Paddings {
  p?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
}

export type DivProps = {
  align?: alignTypes;
  justify?: justifyTypes;
  position?: string;
} & AdjustableDimensions &
  Margins &
  Paddings;

export interface DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export type ErrorContainerProps = {} & ThemeProps;

export type FileListItemProps = {
  file: FileInterface;
  handleDelete?: (id: number) => void;
  handleSelect?: (id: number) => void;
  handleUpload?: (id: number) => void;
  selected: boolean;
  submitField: (values: { [key: string]: string }) => void;
};

export type FileListProps = {
  files: FileInterface[];
  handleDelete?: (id: number) => void;
  handleSelect?: (id: number) => void;
  handleUpload?: (id: number) => void;
  selectedFile: number | null;
  submitField: (values: { [key: string]: string }) => void;
};

export interface IconProps extends AdjustableDimensions, PositioningInterface {
  color?: string;
}

export interface PlayerConfigInterface {
  audioFile: FileInterface;
  canvas?: HTMLCanvasElement | null;
  container?: HTMLDivElement | null;
  handleStartPlaying?: () => void;
  handlePlaying?: (miliseconds: number) => void;
  handleFinishPlaying?: () => void;
  visualizer: {
    enabled: boolean;
    lineColor?: string;
    lineWidth?: number;
  };
}

export interface PositioningInterface {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export interface RecorderConfigInterface {
  canvas?: HTMLCanvasElement | null;
  handleStartRecording?: () => void;
  handleRecording?: (miliseconds: number) => void;
  handleFinishRecording?: (blob: Blob) => void;
  setFiles: (value: React.SetStateAction<FileInterface[]>) => void;
  visualizer: {
    enabled: boolean;
    lineColor?: string;
    lineWidth?: number;
  };
}

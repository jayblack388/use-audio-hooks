import styled from 'styled-components';
import { BlockSpan, ColDiv, RowDiv } from '../../Layouts';

export const Audio = styled.audio``;
export const AudioContainer = styled(ColDiv)`
  align-items: center;
  justify-content: center;
`;
export const CheckBox = styled.div`
  background: ${(props: { checked: boolean }) =>
    props.checked ? '#810677' : 'transparent'};
  border: 3px solid #000;
  border-radius: 50%;
  height: 100%;
  position: relative;
  width: 100%;
`;
export const Duration = styled(BlockSpan)``;
export const FilesList = styled.ul`
  padding: 0;
  text-align: center;
  width: 50%;
`;
export const FileListItemContainer = styled.li`
  align-items: center;
  display: flex;
  justify-content: space-between;
  list-style: none;
  form > div {
    margin: 0;
    padding: 0;
  }
`;
export const FileListItem = styled.button`
  background: none;
  border: none;
  color: #0071bc;
  cursor: pointer;
  font-size: '0.9rem';
  padding: 0.8rem 1.6rem;
  text-decoration-color: #0071bc;
  text-decoration: none;
  :focus {
    outline: none;
  }
`;
export const IconButton = styled.button`
  background: transparent;
  border: none;
  height: 2.5rem;
  padding: 0;
  position: relative;
  width: 2.5rem;
  :focus {
    outline: none;
  }
`;
export const IconContainer = styled(RowDiv)`
  align-items: center;
  justify-content: ${(props: { selected: boolean }) =>
    props.selected ? 'space-evenly' : 'flex-start'};
  min-width: 5rem;
`;
export const PlayerRecorderContainer = styled(ColDiv)`
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
export const RecordButton = styled.button`
  height: 5rem;
  width: 5rem;
  background: #a40a88;
  border-radius: 50%;
  position: absolute;
  font-size: x-large;
  left: 17%;
  :focus {
    outline: none;
  }
`;
export const Visualizer = styled.canvas`
  background: linear-gradient(270deg, #1c0561, #630891);
  border-radius: 5rem;
  width: 66%;
  height: 5rem;
`;
export const VisualizerContainer = styled(RowDiv)`
  position: relative;
  justify-content: center;
  width: 100%;
`;

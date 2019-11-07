import styled from 'styled-components';
import {
  AdjustableDimensions,
  ErrorContainerProps,
  FieldContainerProps,
  RequiredProps,
} from '../../types';
import { BlockSpan, ColDiv, RowDiv } from '../Layouts';

const sharedInputStyles = () => `
  background: transparent;
  border-width: 0;
  border-bottom: 1px solid #ebebeb;
  padding: 0 0 0.25rem 0;
  text-align: center;
  transition: all 0.5s ease-in-out;
  width: 100%;
  :focus {
    background: transparent;
    border-bottom: 3px solid #0071BC;
    box-shadow: 0px 10px 5px -5px rgba(121, 211, 255, 0.75);
    margin-bottom: -2px;
    outline: 0;
  }
`;

export const ErrorContainer = styled(RowDiv)`
  height: 1.8rem;
  font-size: 1.2rem;
  color: ${(props: ErrorContainerProps) =>
    props.theme ? props.theme.colors.danger : '#CC0000'};
`;

export const FieldContainer = styled(ColDiv)`
  padding: 0.8rem 0;
  ${(props: FieldContainerProps) =>
    props.error
      ? `
      border: 1px solid #CC0000;
      margin-bottom: 0;
    `
      : `
      margin-bottom: 1.8rem;
    `}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(props: AdjustableDimensions) =>
    props.height ? `height: ${props.height}` : ''}
  ${(props: AdjustableDimensions) =>
    props.width ? `width: ${props.width}` : ''}
`;

export const Input = styled.input`
  ${() => sharedInputStyles()}
`;

export const Label = styled(BlockSpan)`
  margin-bottom: 0.9rem;
`;

export const LabelContainer = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Required = styled.sup`
  color: #cc0000;
  ::after {
    content: '\u2217';
  }
`;

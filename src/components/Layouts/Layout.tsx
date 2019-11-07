import styled from 'styled-components';
import { DivProps } from '../../types';

export const FlexDiv = styled.div`
  display: flex;
  ${(props: DivProps) => (props.height ? `height: ${props.height}` : '')}
  ${(props: DivProps) => (props.minH ? `min-height: ${props.minH}` : '')}
  ${(props: DivProps) => (props.maxH ? `max-height: ${props.maxH}` : '')}
  ${(props: DivProps) => (props.width ? `width: ${props.width}` : '')}
  ${(props: DivProps) => (props.minW ? `min-width: ${props.minW}` : '')}
  ${(props: DivProps) => (props.maxW ? `max-width: ${props.maxW}` : '')}
  ${(props: DivProps) => props.justify ? `justify-content: ${props.justify}` : ''}
  ${(props: DivProps) => (props.align ? `align-items: ${props.align}` : '')}
  ${(props: DivProps) => props.p ? `padding: ${typeof props.p === 'number' ? `${props.p}rem` : props.p}` : ''}
  ${(props: DivProps) => props.pt ? `padding-top: ${ typeof props.pt === 'number' ? `${props.pt}rem` : props.pt }` : ''}
  ${(props: DivProps) => props.pr ? `padding-right: ${ typeof props.pr === 'number' ? `${props.pr}rem` : props.pr }` : ''}
  ${(props: DivProps) => props.pb ? `padding-bottom: ${ typeof props.pb === 'number' ? `${props.pb}rem` : props.pb }` : ''}
  ${(props: DivProps) => props.pl ? `padding-left: ${ typeof props.pl === 'number' ? `${props.pl}rem` : props.pl }` : ''}
  ${(props: DivProps) => props.m ? `margin: ${typeof props.m === 'number' ? `${props.m}rem` : props.m}` : ''}
  ${(props: DivProps) => props.mt ? `margin-top: ${ typeof props.mt === 'number' ? `${props.mt}rem` : props.mt }` : ''}
  ${(props: DivProps) => props.mr ? `margin-right: ${ typeof props.mr === 'number' ? `${props.mr}rem` : props.mr }` : ''}
  ${(props: DivProps) => props.mb ? `margin-bottom: ${ typeof props.mb === 'number' ? `${props.mb}rem` : props.mb }` : ''}
  ${(props: DivProps) => props.ml ? `margin-left: ${ typeof props.ml === 'number' ? `${props.ml}rem` : props.ml }` : ''}
  position: ${(props: DivProps) => props.position || 'relative'};
`;
export const RowDiv = styled(FlexDiv)`
  flex-direction: row;
`;
export const ColDiv = styled(FlexDiv)`
  flex-direction: column;
`;
export const BlockSpan = styled.span`
  display: block;
`;

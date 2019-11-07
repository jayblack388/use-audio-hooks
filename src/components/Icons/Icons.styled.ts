import styled from 'styled-components';

import { IconProps } from '../../types';

export const SVG = styled.svg`
  height: ${(props: IconProps) => props.height || '2rem'};
  position: absolute;
  left: ${(props: IconProps) =>
    props.left
      ? typeof props.left === 'number'
        ? `${props.left}%`
        : props.left
      : '50%'};
  top: ${(props: IconProps) =>
    props.top
      ? typeof props.top === 'number'
        ? `${props.top}%`
        : props.top
      : '50%'};
  transform: translate(-50%, -50%);
`;

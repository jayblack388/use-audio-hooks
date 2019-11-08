import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Play: FC<IconProps> = ({ color, height, left, top, width }) => (
  <S.SVG
    height={height}
    left={left}
    top={top}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8.4666665 8.4666665"
    x="0px"
    y="0px"
  >
    <g transform="translate(0,-288.53332)">
      <path
        fill={color || '#fff'}
        d="m 1.3317479,289.06258 a 0.26460979,0.26460979 0 0 0 -0.2733675,0.26459 v 6.87917 a 0.26460979,0.26460979 0 0 0 0.3989414,0.22789 l 5.8208333,-3.43959 a 0.26460979,0.26460979 0 0 0 0,-0.45578 l -5.8208333,-3.43958 a 0.26460979,0.26460979 0 0 0 -0.1255739,-0.0367 z"
      />
    </g>
    <text
      x="0"
      y="23.4666669"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      Created by Nawicon
    </text>
    <text
      x="0"
      y="28.4666669"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      from the Noun Project
    </text>
  </S.SVG>
);

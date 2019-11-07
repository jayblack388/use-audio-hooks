import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Microphone: FC<IconProps> = ({
  color,
  height,
  left,
  top,
  width,
}) => (
  <S.SVG
    height={height}
    left={left}
    top={top}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    x="0px"
    y="0px"
  >
    <title>music, sound, volume, mic, microphone, recording</title>
    <g data-name="Layer 20">
      <path
        fill={color || '#E3AE0C'}
        d="M9,17V9A7,7,0,0,1,23,9v8A7,7,0,0,1,9,17Zm15-4v5c0,3.86-3.59,7-8,7s-8-3.14-8-7V13H6v5c0,4.66,3.95,8.5,9,9V28H10v2H22V28H17V27c5.05-.45,9-4.29,9-8.95V13Z"
      />
    </g>
    <text
      x="0"
      y="47"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      Created by Caesar Rizky Kurniawan
    </text>
    <text
      x="0"
      y="52"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      from the Noun Project
    </text>
  </S.SVG>
);

import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Close: FC<IconProps> = ({ color, height, left, top, width }) => (
  <S.SVG
    height={height}
    left={left}
    top={top}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 297 297"
    x="0px"
    y="0px"
    fill-rule="evenodd"
    clip-rule="evenodd"
  >
    <g>
      <path
        fill={color || '#810677'}
        d="M89 184l36 -35 -36 -36c-3,-3 -3,-8 0,-12l12 -12c4,-3 9,-3 12,0l36 36 35 -36c3,-3 9,-3 12,0l12 12c3,4 3,9 0,12l-35 36 35 35c3,3 3,9 0,12l-12 12c-3,3 -9,3 -12,0l-35 -35 -36 35c-3,3 -8,3 -12,0l-12 -12c-3,-3 -3,-9 0,-12z"
      />
      <path
        fill={color || '#810677'}
        d="M149 0c82,0 148,67 148,149 0,82 -66,148 -148,148 -82,0 -149,-66 -149,-148 0,-82 67,-149 149,-149zm0 20c-71,0 -129,58 -129,129 0,71 58,128 129,128 71,0 128,-57 128,-128 0,-71 -57,-129 -128,-129z"
      />
    </g>
    <text
      x="0"
      y="312"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      Created by My Toley
    </text>
    <text
      x="0"
      y="317"
      fill="#000000"
      fontSize="5px"
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      from the Noun Project
    </text>
  </S.SVG>
);

import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Upload: FC<IconProps> = ({ color, height, left, top, width }) => (
  <S.SVG
    height={height}
    left={left}
    top={top}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    x="0px"
    y="0px"
  >
    <g>
      <path
        fill={color || '#810677'}
        d="M114.4,481h283.1c25.9,0,47.4-20.7,47.4-46.7v-193c0-25.9-21.5-47.3-47.4-47.3h-43.4c-9.4,0-17,7.6-17,17   s7.6,17,17,17h43.4c7.2,0,13.4,6.1,13.4,13.3v193c0,7.2-6.3,12.7-13.4,12.7H114.4c-7.2,0-13.4-5.5-13.4-12.7v-193   c0-7.2,6.3-13.3,13.4-13.3h43.4c9.4,0,17-7.6,17-17s-7.6-17-17-17h-43.4C88.5,194,67,215.4,67,241.3v193   C67,460.3,88.5,481,114.4,481z"
      />
      <path
        fill={color || '#810677'}
        d="M211.2,112L239,86.4v225.5c0,9.4,7.6,17,17,17s17-7.6,17-17V86.4l27.8,25.6c3.3,3,7.4,4.5,11.5,4.5   c4.6,0,9.2-1.8,12.5-5.5c6.4-6.9,5.9-17.7-1-24l-56.3-51.8c-6.5-6-16.5-6-23,0L188.2,87c-6.9,6.4-7.4,17.1-1,24   C193.5,117.9,204.3,118.4,211.2,112z"
      />
    </g>
    <text
      x="0"
      y="527"
      fill="#000000"
      font-size="5px"
      font-weight="bold"
      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      Created by Chandru
    </text>
    <text
      x="0"
      y="532"
      fill="#000000"
      font-size="5px"
      font-weight="bold"
      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      from the Noun Project
    </text>
  </S.SVG>
);

import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Pause: FC<IconProps> = ({ color, height, left, top, width }) => (
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
        d="M 1.8520833,289.06249 A 0.26460979,0.26460979 0 0 0 1.5875,289.32707 v 6.87917 a 0.26460979,0.26460979 0 0 0 0.2645833,0.26458 h 1.5875 a 0.26460979,0.26460979 0 0 0 0.2645834,-0.26458 v -6.87917 a 0.26460979,0.26460979 0 0 0 -0.2645834,-0.26458 z m 3.175,0 A 0.26460979,0.26460979 0 0 0 4.7625,289.32707 v 6.87917 a 0.26460979,0.26460979 0 0 0 0.2645833,0.26458 h 1.5875001 a 0.26460979,0.26460979 0 0 0 0.2645833,-0.26458 v -6.87917 a 0.26460979,0.26460979 0 0 0 -0.2645833,-0.26458 z"
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

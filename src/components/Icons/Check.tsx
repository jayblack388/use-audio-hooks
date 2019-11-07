import React, { FC } from 'react';

import { IconProps } from '../../types';
import * as S from './Icons.styled';

export const Check: FC<IconProps> = ({
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
    viewBox="0 0 95 95"
    x="0px"
    y="0px"
    fill-rule="evenodd"
    clip-rule="evenodd"
  >
    <g>
      <path
        fill={color || '#21D4FD'}
        d="M12 41c4,3 8,7 12,11l1 1c16,-22 36,-40 60,-53l10 18c-25,14 -45,33 -60,57l-8 14c-8,-11 -16,-23 -27,-31l12 -17z"
      />
    </g>
    <text
      x="0"
      y="104"
      fill="#000000"
      font-size="5px"
      font-weight="bold"
      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      Created by Zahroe
    </text>
    <text
      x="0"
      y="109"
      fill="#000000"
      font-size="5px"
      font-weight="bold"
      font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      from the Noun Project
    </text>
  </S.SVG>
);

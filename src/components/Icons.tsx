import React from 'react';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';

type IconProps = { size?: number; color?: string };

export function BackArrowIcon({ size = 24, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color} />
    </Svg>
  );
}

export function MapPinIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <Circle cx={12} cy={9} r={2.5} fill="white" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 16, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ size = 24, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 00-5 5v2.7c0 .6-.2 1.2-.6 1.7L5 14.5c-.7 1 0 2.5 1.3 2.5h11.4c1.3 0 2-1.5 1.3-2.5l-1.4-2.1c-.4-.5-.6-1.1-.6-1.7V8a5 5 0 00-5-5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function PersonIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.6} stroke={color} strokeWidth={1.8} />
      <Path
        d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 20, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Line x1={21} y1={21} x2={16.2} y2={16.2} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function LeafIcon({ size = 16, color = '#3F9142' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 20c0-8 5-14 16-14 0 11-6 16-14 16-.8 0-1.5-.1-2-.3z"
        fill={color}
      />
      <Path d="M6 18C10 14 14 10 19 6" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = '#F0A020' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5-4.9-4.5 6.6-.7L12 2.5z"
        fill={color}
      />
    </Svg>
  );
}

export function ClockIcon({ size = 16, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DotIcon({ size = 10, color = '#3F9142' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill={color} />
    </Svg>
  );
}

export function HeartIcon({ size = 20, color = Colors.dark, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.3s-7.5-4.7-9.6-9.2C1.2 8 2.6 4.6 5.9 3.8c2-.5 3.9.3 5.1 2 .3.4.9.4 1.2 0 1.2-1.7 3.1-2.5 5.1-2 3.3.8 4.7 4.2 3.5 7.3-2.1 4.5-9.6 9.2-9.6 9.2z"
        stroke={color}
        strokeWidth={1.8}
        fill={filled ? color : 'none'}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FilterClockIcon({ size = 16, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={13} r={8} stroke={color} strokeWidth={1.8} />
      <Path d="M12 9v4l2.5 1.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={9} y1={2} x2={15} y2={2} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function HouseIcon({ size = 24, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5L12 4l8 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Rect x={10} y={14} width={4} height={6} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function OrdersIcon({ size = 24, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11a8 8 0 0116 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line x1={3} y1={11} x2={21} y2={11} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 11V7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x={4} y={16} width={16} height={2.4} rx={1.2} fill={color} />
    </Svg>
  );
}

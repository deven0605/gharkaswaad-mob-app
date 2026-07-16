import React from 'react';
import Svg, { Path, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
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

export function BreadIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 4c4.5 0 8 2.7 8 7 0 5-4 9-8 9s-8-4-8-9c0-4.3 3.5-7 8-7z"
        fill={color}
      />
      <Circle cx={9} cy={11} r={0.9} fill="#fff" opacity={0.6} />
      <Circle cx={13.5} cy={9.5} r={0.9} fill="#fff" opacity={0.6} />
      <Circle cx={13} cy={14.5} r={0.9} fill="#fff" opacity={0.6} />
    </Svg>
  );
}

export function RiceBowlIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11h18a9 8 0 01-18 0z" fill={color} />
      <Path d="M12 3v3M8 4.5L9 7M16 4.5L15 7" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function SweetIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12h16a8 7 0 01-16 0z" fill={color} />
      <Circle cx={12} cy={8} r={3} fill={color} />
    </Svg>
  );
}

export function VegetableIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={10} cy={14} r={6} fill={color} />
      <Circle cx={16} cy={12} r={4} fill={color} opacity={0.7} />
      <Path d="M9 8c0-2 1-3.5 2.5-4.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function BeverageIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3h10l-1.2 15.5a2 2 0 01-2 1.8H10.2a2 2 0 01-2-1.8L7 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M7.6 9.5h8.8" stroke={color} strokeWidth={1.8} />
      <Path d="M6.5 3h11" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 20, color = '#C0392B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function TagIcon({ size = 18, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.5 3H5a1 1 0 00-1 1v7.5a1 1 0 00.3.7l9.5 9.5a1 1 0 001.4 0l7.5-7.5a1 1 0 000-1.4l-9.5-9.5a1 1 0 00-.7-.3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={8} r={1.4} fill={color} />
    </Svg>
  );
}

export function PlusCircleIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 22, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={7} width={18} height={13} rx={2} stroke={color} strokeWidth={1.8} />
      <Path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Line x1={3} y1={12} x2={21} y2={12} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function CheckIcon({ size = 18, color = '#3F9142' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BagIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 8h12l1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L6 8z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function WalletIcon({ size = 24, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7a2 2 0 012-2h11a1 1 0 011 1v2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 7v11a2 2 0 002 2h13a1 1 0 001-1v-9a1 1 0 00-1-1H6a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx={16.5} cy={13.5} r={1.4} fill={color} />
    </Svg>
  );
}

export function CartIcon({ size = 24, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4h2l2.4 12.1a2 2 0 002 1.9h8.2a2 2 0 002-1.9L21 8H6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={9.5} cy={21} r={1.4} fill={color} />
      <Circle cx={17.5} cy={21} r={1.4} fill={color} />
    </Svg>
  );
}

export function PhoneIcon({ size = 20, color = '#3F9142' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChatIcon({ size = 20, color = '#3F9142' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={10.5} r={1} fill={color} />
      <Circle cx={12} cy={10.5} r={1} fill={color} />
      <Circle cx={16} cy={10.5} r={1} fill={color} />
    </Svg>
  );
}

export function ScooterIcon({ size = 20, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={6} cy={18} r={2.4} stroke={color} strokeWidth={1.6} />
      <Circle cx={18} cy={18} r={2.4} stroke={color} strokeWidth={1.6} />
      <Path d="M6 18h4l2-6h3M15 12l2 6h1" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 8h3l1 4" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={9} cy={6} r={1.4} fill={color} />
    </Svg>
  );
}

export function UtensilsIcon({ size = 18, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 2v8M5 2v5a2 2 0 004 0V2M7 10v12"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 2c-1.5 0-3 1.8-3 5s1.5 5 3 5v10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EnvelopeIcon({ size = 18, color = Colors.dark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color} />
    </Svg>
  );
}

export function PencilIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill={color}
      />
    </Svg>
  );
}

export function HelpIcon({ size = 26, color = '#3B7DD8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={color} />
      <SvgText x={12} y={16.5} fontSize={13} fontWeight="bold" fill="#fff" textAnchor="middle">
        ?
      </SvgText>
    </Svg>
  );
}

export function DocumentIcon({ size = 26, color = '#1E9E8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 2h9l5 5v15a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" fill={color} />
      <Path d="M14 2v5a1 1 0 001 1h5" fill="#fff" opacity={0.35} />
      <Line x1={8} y1={13} x2={16} y2={13} stroke="#fff" strokeWidth={1.4} />
      <Line x1={8} y1={16.5} x2={16} y2={16.5} stroke="#fff" strokeWidth={1.4} />
    </Svg>
  );
}

export function InfoIcon({ size = 26, color = Colors.muted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={color} />
      <Circle cx={12} cy={7.5} r={1.3} fill="#fff" />
      <Line x1={12} y1={11} x2={12} y2={17} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function LogoutIcon({ size = 20, color = '#C0392B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M16 16l5-4-5-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={21} y1={12} x2={9} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function TrayIcon({ size = 22, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 16a8 5 0 0116 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={2} y1={16} x2={22} y2={16} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={10} y1={6} x2={10} y2={4} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={2} y1={9} x2={5} y2={9} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={2} y1={12} x2={6} y2={12} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
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

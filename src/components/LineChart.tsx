import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line as SvgLine, Rect, Text as SvgText } from 'react-native-svg';

interface LineChartProps {
  data: number[];
  width: number;
  height: number;
  color?: string;
  showDots?: boolean;
  activeIndex?: number;
}

export function LineChart({
  data,
  width,
  height,
  color = '#438883',
  showDots = false,
  activeIndex,
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.emptyContainer} />
      </View>
    );
  }

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const padding = 20;
  const topPadding = 45; // Space for tooltip
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - topPadding;

  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = topPadding + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  const controlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = {
      x: n.x - p.x,
      y: n.y - p.y,
    };
    const angle = Math.atan2(o.y, o.x);
    const length = Math.sqrt(o.x * o.x + o.y * o.y) * smoothing;
    const x = current.x + Math.cos(angle + (reverse ? Math.PI : 0)) * length;
    const y = current.y + Math.sin(angle + (reverse ? Math.PI : 0)) * length;
    return { x, y };
  };

  const bezierCommand = (point: any, i: number, a: any[]) => {
    const cp1 = controlPoint(a[i - 1], a[i - 2], point);
    const cp2 = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${point.x},${point.y}`;
  };

  const pathD = points
    .map((point, index, a) => index === 0 ? `M ${point.x},${point.y}` : bezierCommand(point, index, a))
    .join(' ');

  const areaPathD = `${pathD} L ${points[points.length - 1]?.x || 0} ${height} L ${padding} ${height} Z`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        <Path d={areaPathD} fill="url(#gradient)" />
        <Path d={pathD} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

        {activeIndex !== undefined && points[activeIndex] && (
          <>
            <SvgLine
              x1={points[activeIndex].x}
              y1={points[activeIndex].y + 10}
              x2={points[activeIndex].x}
              y2={height}
              stroke="#999999"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            {/* Outline Circle */}
            <Circle cx={points[activeIndex].x} cy={points[activeIndex].y} r={7} fill="#FFFFFF" />
            <Circle cx={points[activeIndex].x} cy={points[activeIndex].y} r={7} fill="transparent" stroke={color} strokeWidth={2} />
            {/* Inner Circle */}
            <Circle cx={points[activeIndex].x} cy={points[activeIndex].y} r={4} fill={color} />
            
            {/* Tooltip Box */}
            <Rect 
              x={points[activeIndex].x - 30} 
              y={points[activeIndex].y - 38} 
              width={60} 
              height={26} 
              rx={8} 
              fill="white" 
              stroke={color} 
              strokeWidth={1} 
            />
            {/* Tooltip bottom pointer outline */}
            <Path 
               d={`M ${points[activeIndex].x - 4} ${points[activeIndex].y - 12} L ${points[activeIndex].x} ${points[activeIndex].y - 6} L ${points[activeIndex].x + 4} ${points[activeIndex].y - 12} Z`}
               fill="white"
               stroke={color}
               strokeWidth={1}
               strokeLinejoin="round"
            />
            {/* Cover line to make it seem unified */}
            <Path 
               d={`M ${points[activeIndex].x - 3} ${points[activeIndex].y - 12.5} L ${points[activeIndex].x + 3} ${points[activeIndex].y - 12.5} Z`}
               stroke="white"
               strokeWidth={2}
            />
            <SvgText
               x={points[activeIndex].x}
               y={points[activeIndex].y - 20}
               fill={color}
               fontSize="12"
               fontWeight="600"
               textAnchor="middle"
            >
              ${points[activeIndex].value.toLocaleString()}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});
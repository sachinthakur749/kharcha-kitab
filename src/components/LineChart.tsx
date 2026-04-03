import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface LineChartProps {
  data: number[];
  width: number;
  height: number;
  color?: string;
  showDots?: boolean;
}

export function LineChart({
  data,
  width,
  height,
  color = Colors.primary,
  showDots = true,
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

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate points
  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  // Create path
  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Create area path (for gradient fill)
  const areaPathD = `${pathD} L ${points[points.length - 1]?.x || 0} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Gradient area */}
        <Path d={areaPathD} fill="url(#gradient)" />

        {/* Line */}
        <Path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {showDots &&
          points.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r={4} fill={color} />
          ))}
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
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Text as SvgText, Line } from 'react-native-svg';
import { useColorScheme } from 'react-native';

interface LineChartData {
  x: number;
  y: number;
  label: string;
}

interface LineChartProps {
  data: LineChartData[];
  width: number;
  height: number;
  title?: string;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width,
  height,
  title,
  color = '#007AFF',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        {title && (
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {title}
          </Text>
        )}
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            No data available
          </Text>
        </View>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - 100;

  const maxY = Math.max(...data.map((d) => d.y));
  const minY = Math.min(...data.map((d) => d.y));
  const maxX = Math.max(...data.map((d) => d.x));
  const minX = Math.min(...data.map((d) => d.x));

  const rangeX = maxX - minX === 0 ? 1 : maxX - minX;
  const rangeY = maxY - minY === 0 ? 1 : maxY - minY;

  const points = data
    .map((point) => {
      const x = padding + ((point.x - minX) / rangeX) * chartWidth;
      const y =
        padding +
        chartHeight -
        ((point.y - minY) / rangeY) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={[styles.container, { width }]}>
      {title && (
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      )}
      <Svg width={width} height={height - 40}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = padding + chartHeight - ratio * chartHeight;
          return (
            <Line
              key={index}
              x1={padding}
              y1={y}
              x2={padding + chartWidth}
              y2={y}
              stroke={isDark ? '#333333' : '#E5E5E5'}
              strokeWidth="1"
            />
          );
        })}

        {/* Line */}
        <Polyline points={points} fill="none" stroke={color} strokeWidth="2" />

        {/* Data points */}
        {data.map((point, index) => {
          const x = padding + ((point.x - minX) / rangeX) * chartWidth;
          const y =
            padding +
            chartHeight -
            ((point.y - minY) / rangeY) * chartHeight;

          return <Circle key={index} cx={x} cy={y} r="4" fill={color} />;
        })}

        {/* Y-axis labels */}
        {[minY, (minY + maxY) / 2, maxY].map((value, index) => {
          const y = padding + chartHeight - (index * chartHeight) / 2;
          return (
            <SvgText
              key={index}
              x={padding - 10}
              y={y + 4}
              fontSize="10"
              fill={isDark ? '#FFFFFF' : '#666666'}
              textAnchor="end"
            >
              {Math.round(value)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
  emptyTextDark: {
    color: '#CCCCCC',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { ChartData } from '../types';
import { useColorScheme } from 'react-native';

interface BarChartProps {
  data: ChartData[];
  width: number;
  height: number;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  title,
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

  const maxValue = Math.max(...data.map((d) => d.value)); // Maximum value for scaling
  const barWidth = data.length > 0 ? (width - 40) / data.length - 10 : 0; // calcualte width of each bar on available space.
  const chartHeight = height - 80; // height for chart area

  return (
    <View style={[styles.container, { width }]}>
      {title && (
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      )}
      <Svg width={width} height={height - 40}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = 20 + index * (barWidth + 10);
          const y = chartHeight - barHeight + 20;

          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + 40}
                fontSize="12"
                fill={isDark ? '#FFFFFF' : '#000000'}
                textAnchor="middle"
              >
                {item.label.length > 8
                  ? item.label.substring(0, 8) + '...'
                  : item.label}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="10"
                fill={isDark ? '#FFFFFF' : '#000000'}
                textAnchor="middle"
              >
                {item.value}
              </SvgText>
            </React.Fragment>
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

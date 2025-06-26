import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface SummaryTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const SummaryTile: React.FC<SummaryTileProps> = ({
  title,
  value,
  subtitle,
  color = '#007AFF',
  icon,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      </View>

      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>

      {subtitle && (
        <Text
          style={[styles.subtitle, isDark && styles.subtitleDark]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    flex: 1,
  },
  titleDark: {
    color: '#CCCCCC',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
  },
  subtitleDark: {
    color: '#AAAAAA',
  },
});

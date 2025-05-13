import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function PerformanceChart({ title, data }) {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={{
          labels: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now'],
          datasets: [{ data }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#111',
          backgroundGradientTo: '#000',
          color: () => `rgba(255, 255, 255, 0.8)`,
          labelColor: () => '#fff',
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#fff',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  chart: {
    borderRadius: 8,
  },
});

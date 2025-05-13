import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';

export default function PerformanceChart({ title, data }) {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        style={{ height: 120 }}
        data={data}
        svg={{ fill: '#00ffcc' }}
        contentInset={{ top: 10, bottom: 10 }}
        spacingInner={0.3}
      >
        <Grid />
      </BarChart>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
});

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AgentGlyph from './AgentGlyph';
import PerformanceChart from './PerformanceChart';

const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];

export default function AgentMetricsBoard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {agents.map((agent) => (
        <View key={agent} style={styles.agentBlock}>
          <AgentGlyph agent={agent} />
          <PerformanceChart
            title={`Metrics - ${agent.toUpperCase()}`}
            data={[
              Math.random() * 100,
              Math.random() * 80,
              Math.random() * 60,
              Math.random() * 90,
              Math.random() * 70,
              Math.random() * 85,
            ]}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  agentBlock: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

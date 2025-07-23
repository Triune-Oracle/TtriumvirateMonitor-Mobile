import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AgentGlyph from './components/AgentGlyph';

// Demo PerformanceChart: simple textual placeholder
function PerformanceChart({ title, data }) {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.chartData}>{data.map((d) => d.toFixed(1)).join(', ')}</Text>
    </View>
  );
}

const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];

export default function AgentMetricsBoard() {
  const navigation = useNavigation();
  const { poeticMode } = useSelector(state => state.swarm);

  const handleAgentPress = (agent) => {
    console.log(`Agent ${agent} pressed`);
    // Could navigate to agent-specific details
  };

  const navigateToScrollResonance = () => {
    navigation.navigate('ScrollResonance');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>TRIUMVIRATE MONITOR</Text>
        <Text style={styles.subtitle}>
          {poeticMode.poeticModeActive ? '✨ Poetic Resonance Active' : 'Standard Monitoring Mode'}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToScrollResonance}
        >
          <Text style={styles.actionButtonText}>📜 SCROLL ECHO METRICS</Text>
        </TouchableOpacity>
      </View>

      {/* Agents Grid */}
      <View style={styles.agentsGrid}>
        {agents.map((agent) => (
          <View key={agent} style={styles.agentBlock}>
            <AgentGlyph agent={agent} onPress={handleAgentPress} />
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
      </View>

      {/* Poetic Mode Status */}
      {poeticMode.poeticModeActive && (
        <View style={styles.poeticStatus}>
          <Text style={styles.poeticStatusTitle}>POETIC MODE ACTIVE</Text>
          <Text style={styles.poeticStatusText}>
            {poeticMode.activeModeAgents.length} agent(s) in lyrical-reflective mode
          </Text>
          <View style={styles.poeticFeatures}>
            <Text style={styles.poeticFeature}>🌙 Aurora overlays enabled</Text>
            <Text style={styles.poeticFeature}>✨ Soft glyph pulses active</Text>
            <Text style={styles.poeticFeature}>💫 Contemplative timing (0.75x)</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffcc',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ffcc',
  },
  actionButtonText: {
    color: '#00ffcc',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  agentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  agentBlock: {
    width: '45%',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  chartContainer: {
    marginTop: 12,
    width: '100%',
  },
  chartTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  chartData: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  poeticStatus: {
    marginTop: 20,
    backgroundColor: '#2a1a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9966CC',
  },
  poeticStatusTitle: {
    color: '#9966CC',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  poeticStatusText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  poeticFeatures: {
    gap: 4,
  },
  poeticFeature: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
});


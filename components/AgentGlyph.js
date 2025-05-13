import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgentGlyph({ agent }) {
  return (
    <View style={styles.container}>
      <Text style={styles.glyph}>{agent.slice(0, 1).toUpperCase()}</Text>
      <Text style={styles.label}>{agent}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  glyph: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ffcc',
  },
  label: {
    fontSize: 14,
    color: '#ccc',
  },
});

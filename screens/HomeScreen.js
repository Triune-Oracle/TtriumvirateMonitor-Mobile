import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AgentGlyph from '../components/AgentGlyph';

export default function HomeScreen() {
  const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TRIUMVIRATE GLYPHIC INDEX</Text>
      {agents.map((agent) => (
        <AgentGlyph key={agent} agent={agent} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 20,
  },
});

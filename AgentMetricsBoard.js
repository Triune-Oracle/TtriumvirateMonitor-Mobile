import React from 'react'; import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';

// Demo AgentGlyph: displays an icon or initial function AgentGlyph({ agent }) { // Placeholder: display first letter as a circle return ( <View style={styles.glyphContainer}> <Text style={styles.glyphText}>{agent.charAt(0).toUpperCase()}</Text> </View> ); }

// Demo PerformanceChart: simple textual placeholder function PerformanceChart({ title, data }) { return ( <View style={styles.chartContainer}> <Text style={styles.chartTitle}>{title}</Text> <Text style={styles.chartData}>{data.map((d) => d.toFixed(1)).join(', ')}</Text> </View> ); }

const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];

export default function AgentMetricsBoard() { return ( <ScrollView contentContainerStyle={styles.container}> {agents.map((agent) => ( <View key={agent} style={styles.agentBlock}> <AgentGlyph agent={agent} /> <PerformanceChart title={Metrics - ${agent.toUpperCase()}} data={[ Math.random() * 100, Math.random() * 80, Math.random() * 60, Math.random() * 90, Math.random() * 70, Math.random() * 85, ]} /> </View> ))} </ScrollView> ); }

const styles = StyleSheet.create({ container: { paddingVertical: 20, paddingHorizontal: 10, }, agentBlock: { marginBottom: 30, borderRadius: 12, backgroundColor: '#1e1e1e', padding: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, }, glyphContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', marginBottom: 8, }, glyphText: { color: '#fff', fontSize: 20, fontWeight: 'bold', }, chartContainer: { marginTop: 8, }, chartTitle: { color: '#fff', fontSize: 16, marginBottom: 4, }, chartData: { color: '#ccc', fontSize: 14, }, });


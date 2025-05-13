import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const glyphMap = {
  oracle: require('../assets/glyphs/oracle.svg'),
  capri: require('../assets/glyphs/capri.svg'),
  gemini: require('../assets/glyphs/gemini.svg'),
  aria: require('../assets/glyphs/aria.svg'),
  conjuror: require('../assets/glyphs/conjuror.svg'),
};

export default function AgentGlyph({ agent }) {
  const glyph = glyphMap[agent.toLowerCase()];
  return (
    <View style={styles.container}>
      <SvgUri
        width="80"
        height="80"
        source={glyph}
      />
      <Text style={styles.label}>{agent.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

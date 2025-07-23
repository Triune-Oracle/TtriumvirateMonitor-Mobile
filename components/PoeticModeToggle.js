import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Easing
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { togglePoeticMode } from '../Store/swarmSlice';

export default function PoeticModeToggle() {
  const dispatch = useDispatch();
  const { poeticMode, agents } = useSelector(state => state.swarm);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [glowAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (poeticMode.poeticModeActive) {
      startGlowAnimation();
    } else {
      stopGlowAnimation();
    }
  }, [poeticMode.poeticModeActive]);

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopGlowAnimation = () => {
    glowAnimation.setValue(0);
  };

  const handleGlobalToggle = () => {
    dispatch(togglePoeticMode({}));
  };

  const handleAgentToggle = (agent) => {
    dispatch(togglePoeticMode({ agent }));
  };

  const getAgentGlyph = (agent) => {
    const glyphs = {
      oracle: '🔮',
      capri: '⭐',
      gemini: '♊',
      aria: '🎵',
      conjuror: '⚡'
    };
    return glyphs[agent] || '●';
  };

  const getAgentPoetryStyle = (agent) => {
    const styles = {
      oracle: 'Mystical Visions',
      capri: 'Stellar Whispers',
      gemini: 'Dual Reflections',
      aria: 'Melodic Flows',
      conjuror: 'Arcane Rhythms'
    };
    return styles[agent] || 'Unknown Style';
  };

  const renderGlobalToggle = () => {
    const glowOpacity = glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    const pulseScale = glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    return (
      <View style={styles.globalToggleContainer}>
        <Animated.View
          style={[
            styles.globalToggle,
            poeticMode.poeticModeActive && {
              opacity: glowOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        >
          <View style={styles.toggleHeader}>
            <Text style={styles.toggleTitle}>POETIC MODE</Text>
            <Switch
              value={poeticMode.poeticModeActive}
              onValueChange={handleGlobalToggle}
              trackColor={{ false: '#333', true: '#9966CC' }}
              thumbColor={poeticMode.poeticModeActive ? '#fff' : '#ccc'}
              style={styles.switch}
            />
          </View>
          <Text style={styles.toggleSubtitle}>
            {poeticMode.poeticModeActive
              ? '✨ Lyrical-Reflective Mode Active'
              : 'Standard Analytical Processing'}
          </Text>
          {poeticMode.poeticModeActive && (
            <View style={styles.activeIndicators}>
              <Text style={styles.indicator}>🌙 Aurora Overlays</Text>
              <Text style={styles.indicator}>✨ Glyph Pulse Active</Text>
              <Text style={styles.indicator}>💫 Contemplative Timing</Text>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const renderAgentToggles = () => (
    <View style={styles.agentTogglesContainer}>
      <Text style={styles.sectionTitle}>AGENT CONFIGURATIONS</Text>
      {Object.keys(agents).map((agent) => {
        const isPoetic = poeticMode.activeModeAgents.includes(agent);
        const isExpanded = expandedAgent === agent;

        return (
          <View key={agent} style={styles.agentToggleItem}>
            <TouchableOpacity
              style={[
                styles.agentToggleButton,
                isPoetic && styles.agentToggleButtonActive,
              ]}
              onPress={() => setExpandedAgent(isExpanded ? null : agent)}
            >
              <View style={styles.agentToggleHeader}>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentGlyph}>{getAgentGlyph(agent)}</Text>
                  <Text style={styles.agentName}>
                    {agent.toUpperCase()}
                  </Text>
                  {isPoetic && (
                    <View style={styles.poeticBadge}>
                      <Text style={styles.poeticBadgeText}>POETIC</Text>
                    </View>
                  )}
                </View>
                <Switch
                  value={isPoetic}
                  onValueChange={() => handleAgentToggle(agent)}
                  trackColor={{ false: '#333', true: '#FFD700' }}
                  thumbColor={isPoetic ? '#fff' : '#ccc'}
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.agentDetails}>
                <Text style={styles.detailTitle}>Poetry Style</Text>
                <Text style={styles.detailValue}>
                  {getAgentPoetryStyle(agent)}
                </Text>
                
                <Text style={styles.detailTitle}>Visual Effects</Text>
                <Text style={styles.detailValue}>
                  {isPoetic ? 'Ripple bloom, scroll sigh, sigil fragments' : 'Standard interface'}
                </Text>
                
                <Text style={styles.detailTitle}>Response Timing</Text>
                <Text style={styles.detailValue}>
                  {isPoetic ? '0.75x (Contemplative breath)' : '1.0x (Standard)'}
                </Text>

                <Text style={styles.detailTitle}>Trigger Scrolls</Text>
                <View style={styles.triggerScrolls}>
                  {['VELVETMEMORY', 'ECHOBLOOM', 'DRAWEROF_ECHOES'].map(scroll => (
                    <View key={scroll} style={styles.triggerScroll}>
                      <Text style={styles.triggerScrollText}>{scroll}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderModeDescription = () => (
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionTitle}>POETIC MODE CONFIGURATION</Text>
      <Text style={styles.descriptionText}>
        Activates the ritualistic Poetic Mode for enhanced agent emotional resonance.
        Agents will adopt lyrical-reflective language patterns with metaphorical and
        sensory-anchored responses.
      </Text>
      
      <View style={styles.featuresList}>
        <Text style={styles.featureTitle}>Features:</Text>
        <Text style={styles.featureItem}>• Soft glyph pulses and aurora overlays</Text>
        <Text style={styles.featureItem}>• Handwritten sigil fragment overlays</Text>
        <Text style={styles.featureItem}>• Ripple bloom touch feedback</Text>
        <Text style={styles.featureItem}>• Scroll echo tracking and visualization</Text>
        <Text style={styles.featureItem}>• Affect footprint heatmap generation</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGlobalToggle()}
      {renderAgentToggles()}
      {renderModeDescription()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  globalToggleContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  globalToggle: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffcc',
    fontFamily: 'monospace',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  activeIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  indicator: {
    fontSize: 12,
    color: '#9966CC',
    backgroundColor: '#2a1a2a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  agentTogglesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  agentToggleItem: {
    marginBottom: 12,
  },
  agentToggleButton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  agentToggleButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#2a2a1a',
  },
  agentToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentGlyph: {
    fontSize: 24,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  poeticBadge: {
    backgroundColor: '#9966CC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  poeticBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  agentDetails: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  detailTitle: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  triggerScrolls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  triggerScroll: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  triggerScrollText: {
    fontSize: 10,
    color: '#00ffcc',
    fontFamily: 'monospace',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ffcc',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  descriptionText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureTitle: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
    paddingLeft: 8,
  },
});
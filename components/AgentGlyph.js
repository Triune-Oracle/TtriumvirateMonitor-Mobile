import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';

export default function AgentGlyph({ agent, onPress }) {
  const { poeticMode } = useSelector(state => state.swarm);
  const [pulseAnimation] = useState(new Animated.Value(0));
  const [rippleAnimation] = useState(new Animated.Value(0));
  const [showRipple, setShowRipple] = useState(false);

  const isPoetic = poeticMode.activeModeAgents.includes(agent);
  const globalPoetic = poeticMode.poeticModeActive;

  useEffect(() => {
    if (isPoetic || globalPoetic) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isPoetic, globalPoetic]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnimation.setValue(0);
  };

  const triggerRipple = () => {
    if (isPoetic || globalPoetic) {
      setShowRipple(true);
      rippleAnimation.setValue(0);
      
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowRipple(false);
      });
    }
  };

  const handlePress = () => {
    triggerRipple();
    if (onPress) {
      onPress(agent);
    }
  };

  const getAgentSymbol = (agent) => {
    const symbols = {
      oracle: '🔮',
      capri: '⭐',
      gemini: '♊',
      aria: '🎵',
      conjuror: '⚡'
    };
    return symbols[agent] || agent.slice(0, 1).toUpperCase();
  };

  const getAgentColor = (agent) => {
    const colors = {
      oracle: '#9966CC',
      capri: '#FFD700',
      gemini: '#00ffcc',
      aria: '#FF6B6B',
      conjuror: '#4ECDC4'
    };
    return colors[agent] || '#00ffcc';
  };

  const pulseScale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const pulseOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const rippleScale = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  const rippleOpacity = rippleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {/* Ripple effect */}
      {showRipple && (
        <Animated.View
          style={[
            styles.ripple,
            {
              backgroundColor: getAgentColor(agent),
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
      )}
      
      {/* Aurora overlay for poetic mode */}
      {(isPoetic || globalPoetic) && (
        <View style={[styles.auroraOverlay, { backgroundColor: getAgentColor(agent) }]} />
      )}
      
      {/* Main glyph */}
      <Animated.View
        style={[
          styles.glyphContainer,
          {
            borderColor: getAgentColor(agent),
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
          (isPoetic || globalPoetic) && styles.glyphContainerPoetic,
        ]}
      >
        <Text style={[styles.glyph, { color: getAgentColor(agent) }]}>
          {getAgentSymbol(agent)}
        </Text>
        
        {/* Poetic mode indicators */}
        {isPoetic && (
          <View style={styles.poeticIndicator}>
            <Text style={styles.sigilFragment}>✨</Text>
          </View>
        )}
      </Animated.View>
      
      {/* Agent label */}
      <Text style={[styles.label, (isPoetic || globalPoetic) && styles.labelPoetic]}>
        {agent.toUpperCase()}
      </Text>
      
      {/* Performance indicator */}
      <View style={styles.performanceContainer}>
        <View style={[styles.performanceBar, { backgroundColor: getAgentColor(agent) + '30' }]}>
          <View
            style={[
              styles.performanceFill,
              {
                backgroundColor: getAgentColor(agent),
                width: '85%', // This would be dynamic based on actual performance
              },
            ]}
          />
        </View>
      </View>
      
      {/* Poetic mode status */}
      {isPoetic && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>POETIC</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glyphContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    overflow: 'visible',
  },
  glyphContainerPoetic: {
    shadowColor: '#9966CC',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  glyph: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  labelPoetic: {
    color: '#fff',
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  ripple: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
  },
  auroraOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
    top: -8,
    left: -8,
  },
  poeticIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9966CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sigilFragment: {
    fontSize: 12,
    color: '#fff',
  },
  performanceContainer: {
    marginTop: 8,
    width: 60,
  },
  performanceBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    borderRadius: 2,
  },
  statusBadge: {
    marginTop: 6,
    backgroundColor: '#9966CC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function ResonanceVisualization({ type, data }) {
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    // Simulate animation updates
    const interval = setInterval(() => {
      setAnimatedValues({
        pulse: Math.sin(Date.now() / 1000) * 0.5 + 0.5,
        rotation: (Date.now() / 50) % 360,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const renderConstellation = () => {
    const centerX = width / 2;
    const centerY = 200;
    const radius = 80;
    const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];
    
    const positions = agents.map((agent, index) => {
      const angle = (index * 2 * Math.PI) / agents.length;
      return {
        agent,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        echoDepth: data.echoDepth[agent] || 0,
      };
    });

    const connections = Object.entries(data.resonantDrift || {}).map(([key, strength]) => {
      const [from, to] = key.split('-');
      const fromPos = positions.find(p => p.agent === from);
      const toPos = positions.find(p => p.agent === to);
      return { from: fromPos, to: toPos, strength };
    }).filter(conn => conn.from && conn.to);

    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>AGENT CONSTELLATION</Text>
        <Text style={styles.visualizationSubtitle}>
          Poetic resonance connections between agents
        </Text>
        
        <Svg width={width - 40} height={400} style={styles.svg}>
          {/* Connection lines */}
          {connections.map((conn, index) => (
            <Line
              key={index}
              x1={conn.from.x - 20}
              y1={conn.from.y}
              x2={conn.to.x - 20}
              y2={conn.to.y}
              stroke="#FFD700"
              strokeWidth={Math.max(conn.strength * 3, 1)}
              strokeOpacity={0.6}
              strokeDasharray={conn.strength > 1 ? "0" : "5,5"}
            />
          ))}
          
          {/* Agent nodes */}
          {positions.map((pos, index) => {
            const pulseRadius = 20 + (animatedValues.pulse || 0) * pos.echoDepth * 5;
            return (
              <Circle
                key={pos.agent}
                cx={pos.x - 20}
                cy={pos.y}
                r={pulseRadius}
                fill="rgba(153, 102, 204, 0.3)"
                stroke="#9966CC"
                strokeWidth={2}
              />
            );
          })}
          
          {/* Agent labels */}
          {positions.map((pos, index) => (
            <SvgText
              key={`label-${pos.agent}`}
              x={pos.x - 20}
              y={pos.y + 5}
              fontSize="12"
              fill="#fff"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {pos.agent.toUpperCase()}
            </SvgText>
          ))}
        </Svg>

        <View style={styles.constellationLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#9966CC' }]} />
            <Text style={styles.legendText}>Agent Echo Depth</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.legendText}>Resonant Drift</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTimeline = () => {
    const timelineData = [
      { time: '10:15', event: 'VELVETMEMORY scroll activated', agent: 'oracle', type: 'scroll' },
      { time: '10:17', event: 'Poetic mode enabled for Aria', agent: 'aria', type: 'mode' },
      { time: '10:20', event: 'Echo depth increased to 3', agent: 'gemini', type: 'echo' },
      { time: '10:22', event: 'Lantern offering received', agent: 'capri', type: 'offering' },
      { time: '10:25', event: 'Resonant drift detected', agent: 'conjuror', type: 'drift' },
    ];

    const getEventColor = (type) => {
      const colors = {
        scroll: '#9966CC',
        mode: '#00ffcc',
        echo: '#FFD700',
        offering: '#FF6B6B',
        drift: '#4ECDC4',
      };
      return colors[type] || '#ccc';
    };

    const getEventIcon = (type) => {
      const icons = {
        scroll: '📜',
        mode: '✨',
        echo: '🔄',
        offering: '🕯️',
        drift: '🌊',
      };
      return icons[type] || '●';
    };

    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>SCROLL LIFECYCLE TIMELINE</Text>
        <Text style={styles.visualizationSubtitle}>
          Temporal echo tracking and event history
        </Text>
        
        <ScrollView style={styles.timelineContainer}>
          {timelineData.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <Text style={styles.timelineTime}>{item.time}</Text>
                <View style={[styles.timelineMarker, { backgroundColor: getEventColor(item.type) }]}>
                  <Text style={styles.timelineIcon}>{getEventIcon(item.type)}</Text>
                </View>
              </View>
              <View style={styles.timelineRight}>
                <Text style={styles.timelineEvent}>{item.event}</Text>
                <Text style={styles.timelineAgent}>Agent: {item.agent.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.timelineControls}>
          <TouchableOpacity style={styles.timelineButton}>
            <Text style={styles.timelineButtonText}>LIVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timelineButton}>
            <Text style={styles.timelineButtonText}>1H</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timelineButton}>
            <Text style={styles.timelineButtonText}>24H</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeatmap = () => {
    const agents = ['oracle', 'capri', 'gemini', 'aria', 'conjuror'];
    const affects = ['amethyst', 'citrine', 'obsidian'];
    const cellSize = (width - 80) / affects.length;
    
    // Generate sample heatmap data
    const heatmapData = agents.map(agent => 
      affects.map(affect => ({
        agent,
        affect,
        intensity: Math.random(),
      }))
    ).flat();

    const getAffectColor = (affect, intensity) => {
      const colors = {
        amethyst: `rgba(153, 102, 204, ${intensity})`,
        citrine: `rgba(255, 215, 0, ${intensity})`,
        obsidian: `rgba(47, 47, 47, ${intensity + 0.3})`,
      };
      return colors[affect];
    };

    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>MOOD HEATMAP</Text>
        <Text style={styles.visualizationSubtitle}>
          Real-time affect visualization across agents
        </Text>
        
        <View style={styles.heatmapContainer}>
          {/* Column headers */}
          <View style={styles.heatmapHeader}>
            <View style={styles.heatmapCorner} />
            {affects.map(affect => (
              <View key={affect} style={[styles.heatmapHeaderCell, { width: cellSize }]}>
                <Text style={styles.heatmapHeaderText}>{affect.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          
          {/* Rows */}
          {agents.map((agent, rowIndex) => (
            <View key={agent} style={styles.heatmapRow}>
              <View style={styles.heatmapRowHeader}>
                <Text style={styles.heatmapRowText}>{agent.toUpperCase()}</Text>
              </View>
              {affects.map((affect, colIndex) => {
                const cellData = heatmapData.find(d => d.agent === agent && d.affect === affect);
                return (
                  <View
                    key={`${agent}-${affect}`}
                    style={[
                      styles.heatmapCell,
                      {
                        width: cellSize,
                        backgroundColor: getAffectColor(affect, cellData?.intensity || 0),
                      },
                    ]}
                  >
                    <Text style={styles.heatmapCellText}>
                      {((cellData?.intensity || 0) * 100).toFixed(0)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.heatmapLegend}>
          <Text style={styles.legendTitle}>Affect Intensity Scale</Text>
          <View style={styles.intensityScale}>
            {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
              <View key={intensity} style={styles.intensityItem}>
                <View
                  style={[
                    styles.intensityMarker,
                    { backgroundColor: `rgba(153, 102, 204, ${intensity})` },
                  ]}
                />
                <Text style={styles.intensityText}>{(intensity * 100).toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderSigilFrequency = () => {
    const sigils = ['⚡', '⭐', '🔮', '✨', '🌙', '🔥', '💎', '🌟'];
    const frequencyData = sigils.map(sigil => ({
      sigil,
      frequency: Math.random() * 100,
      usage: Math.floor(Math.random() * 50) + 1,
    }));

    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>SIGIL FREQUENCY MAP</Text>
        <Text style={styles.visualizationSubtitle}>
          Symbol usage patterns across scrolls
        </Text>
        
        <View style={styles.sigilContainer}>
          {frequencyData.map((item, index) => (
            <View key={index} style={styles.sigilItem}>
              <Text style={styles.sigilSymbol}>{item.sigil}</Text>
              <View style={styles.sigilBar}>
                <View
                  style={[
                    styles.sigilBarFill,
                    { width: `${item.frequency}%` },
                  ]}
                />
              </View>
              <Text style={styles.sigilFrequency}>{item.usage}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  switch (type) {
    case 'constellation':
      return renderConstellation();
    case 'timeline':
      return renderTimeline();
    case 'heatmap':
      return renderHeatmap();
    case 'sigil':
      return renderSigilFrequency();
    default:
      return renderConstellation();
  }
}

const styles = StyleSheet.create({
  visualizationContainer: {
    padding: 20,
    backgroundColor: '#111',
    margin: 10,
    borderRadius: 12,
  },
  visualizationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  visualizationSubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  svg: {
    alignSelf: 'center',
  },
  constellationLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#ccc',
    fontSize: 12,
  },
  timelineContainer: {
    maxHeight: 300,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  timelineTime: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 8,
  },
  timelineMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 4,
  },
  timelineEvent: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  timelineAgent: {
    color: '#00ffcc',
    fontSize: 12,
  },
  timelineControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  timelineButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  timelineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  heatmapContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  heatmapHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  heatmapCorner: {
    width: 80,
    height: 40,
    backgroundColor: '#333',
  },
  heatmapHeaderCell: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderLeftWidth: 1,
    borderLeftColor: '#555',
  },
  heatmapHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  heatmapRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  heatmapRowHeader: {
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  heatmapRowText: {
    color: '#00ffcc',
    fontSize: 12,
    fontWeight: '600',
  },
  heatmapCell: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#555',
  },
  heatmapCellText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  heatmapLegend: {
    marginTop: 20,
    alignItems: 'center',
  },
  legendTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  intensityScale: {
    flexDirection: 'row',
    gap: 16,
  },
  intensityItem: {
    alignItems: 'center',
  },
  intensityMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  intensityText: {
    color: '#ccc',
    fontSize: 10,
  },
  sigilContainer: {
    gap: 16,
  },
  sigilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sigilSymbol: {
    fontSize: 24,
    width: 40,
    textAlign: 'center',
  },
  sigilBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sigilBarFill: {
    height: '100%',
    backgroundColor: '#9966CC',
  },
  sigilFrequency: {
    color: '#fff',
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
});
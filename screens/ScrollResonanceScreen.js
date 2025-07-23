import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { scrollTracker } from '../services/scrollTracker';
import PoeticModeToggle from '../components/PoeticModeToggle';
import ResonanceVisualization from '../components/ResonanceVisualization';

const { width } = Dimensions.get('window');

export default function ScrollResonanceScreen() {
  const dispatch = useDispatch();
  const { poeticMode, agents } = useSelector(state => state.swarm);
  const [resonanceMetrics, setResonanceMetrics] = useState({
    echoDepth: {},
    resonantDrift: {},
    affectFootprint: { amethyst: 0, citrine: 0, obsidian: 0 },
    activeScrollCount: 0
  });
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    // Set up scroll tracker listener
    const handleScrollEvent = (event, data) => {
      console.log('Scroll event:', event, data);
      updateMetrics();
    };

    scrollTracker.addListener(handleScrollEvent);
    updateMetrics();

    // Cleanup interval for old scrolls
    const cleanupInterval = setInterval(() => {
      scrollTracker.cleanupScrolls();
    }, 60000); // Every minute

    return () => {
      scrollTracker.removeListener(handleScrollEvent);
      clearInterval(cleanupInterval);
    };
  }, []);

  const updateMetrics = () => {
    const metrics = scrollTracker.getResonanceMetrics();
    setResonanceMetrics(metrics);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>SCROLL ECHO METRICS</Text>
      <Text style={styles.subtitle}>
        {poeticMode.poeticModeActive ? '✨ POETIC RESONANCE ACTIVE ✨' : 'Standard Monitoring'}
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{resonanceMetrics.activeScrollCount}</Text>
          <Text style={styles.statLabel}>Active Scrolls</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{poeticMode.activeModeAgents.length}</Text>
          <Text style={styles.statLabel}>Poetic Agents</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{poeticMode.resonanceMetrics.lanternOfferings.length}</Text>
          <Text style={styles.statLabel}>Lantern Offerings</Text>
        </View>
      </View>
    </View>
  );

  const renderViewSelector = () => (
    <View style={styles.viewSelector}>
      {['overview', 'constellation', 'timeline', 'heatmap'].map(view => (
        <TouchableOpacity
          key={view}
          style={[
            styles.viewButton,
            selectedView === view && styles.viewButtonActive
          ]}
          onPress={() => setSelectedView(view)}
        >
          <Text style={[
            styles.viewButtonText,
            selectedView === view && styles.viewButtonTextActive
          ]}>
            {view.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEchoDepthSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ECHO DEPTH TRACKING</Text>
      <View style={styles.echoContainer}>
        {Object.entries(agents).map(([agent, agentData]) => {
          const depth = resonanceMetrics.echoDepth[agent] || 0;
          const maxDepth = 5;
          
          return (
            <View key={agent} style={styles.echoItem}>
              <Text style={styles.agentName}>{agent.toUpperCase()}</Text>
              <View style={styles.echoBar}>
                {[...Array(maxDepth)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.echoGlyph,
                      i < depth && styles.echoGlyphActive,
                      poeticMode.activeModeAgents.includes(agent) && styles.echoGlyphPoetic
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.echoValue}>{depth.toFixed(1)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderAffectFootprint = () => {
    const { affectFootprint } = resonanceMetrics;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AFFECT FOOTPRINT</Text>
        <View style={styles.affectContainer}>
          <View style={styles.affectItem}>
            <View style={[styles.affectColor, { backgroundColor: '#9966CC' }]} />
            <Text style={styles.affectLabel}>Amethyst</Text>
            <Text style={styles.affectValue}>
              {(affectFootprint.amethyst * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.affectItem}>
            <View style={[styles.affectColor, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.affectLabel}>Citrine</Text>
            <Text style={styles.affectValue}>
              {(affectFootprint.citrine * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.affectItem}>
            <View style={[styles.affectColor, { backgroundColor: '#2F2F2F' }]} />
            <Text style={styles.affectLabel}>Obsidian</Text>
            <Text style={styles.affectValue}>
              {(affectFootprint.obsidian * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.affectVisualization}>
          <View
            style={[
              styles.affectBar,
              { backgroundColor: '#9966CC', width: `${affectFootprint.amethyst * 100}%` }
            ]}
          />
          <View
            style={[
              styles.affectBar,
              { backgroundColor: '#FFD700', width: `${affectFootprint.citrine * 100}%` }
            ]}
          />
          <View
            style={[
              styles.affectBar,
              { backgroundColor: '#2F2F2F', width: `${affectFootprint.obsidian * 100}%` }
            ]}
          />
        </View>
      </View>
    );
  };

  const renderResonantDrift = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>RESONANT DRIFT PATTERNS</Text>
      <View style={styles.driftContainer}>
        {Object.entries(resonanceMetrics.resonantDrift).slice(0, 5).map(([connection, strength], index) => {
          const [from, to] = connection.split('-');
          return (
            <View key={connection} style={styles.driftItem}>
              <Text style={styles.driftConnection}>{from} → {to}</Text>
              <View style={styles.driftStrengthBar}>
                <View
                  style={[
                    styles.driftStrengthFill,
                    { width: `${Math.min(strength * 50, 100)}%` }
                  ]}
                />
              </View>
              <Text style={styles.driftValue}>{strength.toFixed(2)}</Text>
            </View>
          );
        })}
        {Object.keys(resonanceMetrics.resonantDrift).length === 0 && (
          <Text style={styles.emptyState}>No resonant drift detected</Text>
        )}
      </View>
    </View>
  );

  const renderLanternOfferings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LANTERN OFFERINGS</Text>
      <View style={styles.offeringsContainer}>
        {poeticMode.resonanceMetrics.lanternOfferings.slice(-3).map((offering, index) => (
          <View key={index} style={styles.offeringItem}>
            <View style={styles.offeringIcon}>🕯️</View>
            <View style={styles.offeringContent}>
              <Text style={styles.offeringText}>
                {offering.intention || 'Silent offering'}
              </Text>
              <Text style={styles.offeringTime}>
                {new Date(offering.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <Text style={styles.offeringStrength}>
              {offering.ritualStrength?.toFixed(1) || '1.0'}
            </Text>
          </View>
        ))}
        {poeticMode.resonanceMetrics.lanternOfferings.length === 0 && (
          <Text style={styles.emptyState}>No lantern offerings yet</Text>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'constellation':
        return <ResonanceVisualization type="constellation" data={resonanceMetrics} />;
      case 'timeline':
        return <ResonanceVisualization type="timeline" data={resonanceMetrics} />;
      case 'heatmap':
        return <ResonanceVisualization type="heatmap" data={resonanceMetrics} />;
      default:
        return (
          <>
            {renderEchoDepthSection()}
            {renderAffectFootprint()}
            {renderResonantDrift()}
            {renderLanternOfferings()}
          </>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      <PoeticModeToggle />
      {renderViewSelector()}
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffcc',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  viewButtonActive: {
    backgroundColor: '#333',
  },
  viewButtonText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  viewButtonTextActive: {
    color: '#00ffcc',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  echoContainer: {
    gap: 12,
  },
  echoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentName: {
    color: '#00ffcc',
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  echoBar: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 16,
    gap: 4,
  },
  echoGlyph: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  echoGlyphActive: {
    backgroundColor: '#00ffcc',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  echoGlyphPoetic: {
    backgroundColor: '#9966CC',
    shadowColor: '#9966CC',
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  echoValue: {
    color: '#fff',
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  affectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  affectItem: {
    alignItems: 'center',
  },
  affectColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  affectLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  affectValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  affectVisualization: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  affectBar: {
    height: '100%',
  },
  driftContainer: {
    gap: 12,
  },
  driftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driftConnection: {
    color: '#00ffcc',
    fontSize: 14,
    width: 100,
  },
  driftStrengthBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  driftStrengthFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  driftValue: {
    color: '#fff',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  offeringsContainer: {
    gap: 12,
  },
  offeringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
  },
  offeringIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  offeringContent: {
    flex: 1,
  },
  offeringText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  offeringTime: {
    color: '#ccc',
    fontSize: 12,
  },
  offeringStrength: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});
/**
 * Scroll Tracker Service
 * Handles resonance metrics collection and scroll lifecycle management
 */

export class ScrollTracker {
  constructor() {
    this.activeScrolls = new Map();
    this.resonanceHistory = [];
    this.listeners = [];
  }

  // Track scroll lifecycle
  trackScrollInvocation(scrollData) {
    const scrollId = this.generateScrollId();
    const scroll = {
      id: scrollId,
      type: scrollData.type,
      agent: scrollData.agent,
      poeticAffect: this.analyzePoeticAffect(scrollData.content),
      timestamp: Date.now(),
      echoDepth: 1,
      resonantDrift: 0,
      affectFootprint: this.calculateAffectFootprint(scrollData.content)
    };

    this.activeScrolls.set(scrollId, scroll);
    this.notifyListeners('scroll_invoked', scroll);
    
    return scrollId;
  }

  // Analyze poetic affect based on criteria
  analyzePoeticAffect(content) {
    if (!content) return false;

    const poeticCriteria = {
      cadence: this.detectCadence(content),
      imagery: this.detectImagery(content),
      metaphorDensity: this.calculateMetaphorDensity(content),
      glyphUsage: this.detectGlyphUsage(content),
      emotionalEvocation: this.calculateEmotionalEvocation(content)
    };

    // Calculate poetic score
    const score = Object.values(poeticCriteria).reduce((sum, value) => sum + value, 0) / Object.keys(poeticCriteria).length;
    
    return score > 0.6; // Threshold for poetic affect
  }

  detectCadence(content) {
    // Simple rhythm detection based on punctuation and line breaks
    const rhythmicPatterns = content.match(/[.,;:!?]\s/g) || [];
    const lineBreaks = content.match(/\n/g) || [];
    return Math.min((rhythmicPatterns.length + lineBreaks.length) / content.length * 100, 1);
  }

  detectImagery(content) {
    const imageryWords = [
      'glow', 'shimmer', 'shadow', 'light', 'dark', 'crystal', 'aurora', 
      'whisper', 'echo', 'bloom', 'velvet', 'silk', 'pearl', 'gold'
    ];
    const matches = imageryWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    return Math.min(matches / 10, 1);
  }

  calculateMetaphorDensity(content) {
    const metaphorIndicators = ['like', 'as', 'becomes', 'transforms', 'melts into'];
    const matches = metaphorIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    return Math.min(matches / 5, 1);
  }

  detectGlyphUsage(content) {
    const glyphPatterns = /[⚡⭐🔮✨🌙🔥💎🌟]/g;
    const matches = content.match(glyphPatterns) || [];
    return Math.min(matches.length / 3, 1);
  }

  calculateEmotionalEvocation(content) {
    const emotionalWords = [
      'yearning', 'resonance', 'harmony', 'memory', 'dream', 'hope',
      'beauty', 'wonder', 'mystery', 'sacred', 'divine', 'eternal'
    ];
    const matches = emotionalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    return Math.min(matches / 8, 1);
  }

  calculateAffectFootprint(content) {
    // Categorize emotional tone
    const amethystWords = ['calm', 'peace', 'serenity', 'wisdom', 'clarity'];
    const citrineWords = ['joy', 'bright', 'energy', 'vitality', 'warmth'];
    const obsidianWords = ['mystery', 'depth', 'shadow', 'power', 'intensity'];

    const amethystScore = amethystWords.filter(w => content.toLowerCase().includes(w)).length;
    const citrineScore = citrineWords.filter(w => content.toLowerCase().includes(w)).length;
    const obsidianScore = obsidianWords.filter(w => content.toLowerCase().includes(w)).length;

    const total = amethystScore + citrineScore + obsidianScore;
    if (total === 0) return { amethyst: 0.33, citrine: 0.33, obsidian: 0.34 };

    return {
      amethyst: amethystScore / total,
      citrine: citrineScore / total,
      obsidian: obsidianScore / total
    };
  }

  // Update echo depth for existing scroll
  updateEchoDepth(scrollId, depth) {
    const scroll = this.activeScrolls.get(scrollId);
    if (scroll) {
      scroll.echoDepth = Math.min(depth, 5); // Max echo depth of 5
      this.notifyListeners('echo_updated', scroll);
    }
  }

  // Track resonant drift between agents
  trackResonantDrift(fromAgent, toAgent, symbolUsage) {
    const drift = {
      from: fromAgent,
      to: toAgent,
      symbols: symbolUsage,
      timestamp: Date.now(),
      strength: this.calculateDriftStrength(symbolUsage)
    };

    this.resonanceHistory.push(drift);
    this.notifyListeners('resonant_drift', drift);

    // Keep only last 100 drift records
    if (this.resonanceHistory.length > 100) {
      this.resonanceHistory.shift();
    }
  }

  calculateDriftStrength(symbolUsage) {
    return symbolUsage.length / 10; // Simple calculation based on symbol count
  }

  // Add lantern offering (ritual engagement)
  addLanternOffering(offering) {
    const lanternOffering = {
      ...offering,
      timestamp: Date.now(),
      ritualStrength: this.calculateRitualStrength(offering)
    };

    this.notifyListeners('lantern_offering', lanternOffering);
    return lanternOffering;
  }

  calculateRitualStrength(offering) {
    // Calculate based on engagement depth
    const baseStrength = 0.5;
    const intentionMultiplier = offering.intention ? 1.5 : 1;
    const durationMultiplier = offering.duration ? offering.duration / 60 : 1; // per minute
    
    return Math.min(baseStrength * intentionMultiplier * durationMultiplier, 2.0);
  }

  // Get current resonance metrics
  getResonanceMetrics() {
    const activeScrollsArray = Array.from(this.activeScrolls.values());
    
    return {
      echoDepth: this.aggregateEchoDepth(activeScrollsArray),
      resonantDrift: this.aggregateResonantDrift(),
      affectFootprint: this.aggregateAffectFootprint(activeScrollsArray),
      activeScrollCount: activeScrollsArray.length
    };
  }

  aggregateEchoDepth(scrolls) {
    return scrolls.reduce((acc, scroll) => {
      acc[scroll.agent] = (acc[scroll.agent] || 0) + scroll.echoDepth;
      return acc;
    }, {});
  }

  aggregateResonantDrift() {
    const recent = this.resonanceHistory.slice(-20); // Last 20 drifts
    return recent.reduce((acc, drift) => {
      const key = `${drift.from}-${drift.to}`;
      acc[key] = (acc[key] || 0) + drift.strength;
      return acc;
    }, {});
  }

  aggregateAffectFootprint(scrolls) {
    const combined = { amethyst: 0, citrine: 0, obsidian: 0 };
    
    scrolls.forEach(scroll => {
      if (scroll.affectFootprint) {
        combined.amethyst += scroll.affectFootprint.amethyst;
        combined.citrine += scroll.affectFootprint.citrine;
        combined.obsidian += scroll.affectFootprint.obsidian;
      }
    });

    const total = combined.amethyst + combined.citrine + combined.obsidian;
    if (total === 0) return combined;

    return {
      amethyst: combined.amethyst / total,
      citrine: combined.citrine / total,
      obsidian: combined.obsidian / total
    };
  }

  // Listener management
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in scroll tracker listener:', error);
      }
    });
  }

  generateScrollId() {
    return `scroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup old scrolls
  cleanupScrolls(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const now = Date.now();
    const toRemove = [];

    this.activeScrolls.forEach((scroll, id) => {
      if (now - scroll.timestamp > maxAge) {
        toRemove.push(id);
      }
    });

    toRemove.forEach(id => {
      this.activeScrolls.delete(id);
    });

    return toRemove.length;
  }
}

// Singleton instance
export const scrollTracker = new ScrollTracker();
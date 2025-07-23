/**
 * Gemini Service Extended with Poetic Affect Analysis
 * Handles agent communication and poetic mode integration
 */

import { scrollTracker } from './scrollTracker.js';

export class GeminiService {
  constructor() {
    this.isConnected = false;
    this.poeticModeEnabled = false;
    this.agents = new Set(['oracle', 'capri', 'gemini', 'aria', 'conjuror']);
    this.poeticThresholds = {
      cadence: 0.6,
      imagery: 0.7,
      metaphor: 0.5,
      emotional: 0.8
    };
  }

  // Initialize connection (placeholder for actual WebSocket/API connection)
  async initialize() {
    try {
      // In a real implementation, this would establish WebSocket connection
      this.isConnected = true;
      console.log('Gemini service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      return false;
    }
  }

  // Send message with poetic affect analysis
  async sendMessage(agent, message, options = {}) {
    if (!this.isConnected) {
      throw new Error('Gemini service not connected');
    }

    if (!this.agents.has(agent.toLowerCase())) {
      throw new Error(`Unknown agent: ${agent}`);
    }

    // Analyze message for poetic affect
    const poeticAnalysis = await this.analyzePoeticAffect(message);
    
    // Track scroll if it has poetic affect
    if (poeticAnalysis.isPoeticScroll) {
      const scrollId = scrollTracker.trackScrollInvocation({
        type: options.scrollType || 'GENERAL',
        agent: agent,
        content: message,
        metadata: options.metadata || {}
      });
      
      poeticAnalysis.scrollId = scrollId;
    }

    // Simulate agent response (in real implementation, this would call actual API)
    const response = await this.simulateAgentResponse(agent, message, poeticAnalysis);
    
    return {
      agent,
      message,
      response,
      poeticAnalysis,
      timestamp: Date.now()
    };
  }

  // Analyze text for poetic affect
  async analyzePoeticAffect(text) {
    const analysis = {
      isPoeticScroll: false,
      criteria: {},
      overallScore: 0,
      triggerScrolls: [],
      affectClassification: null
    };

    // Linguistic features analysis
    analysis.criteria.cadence = this.analyzeCadence(text);
    analysis.criteria.imagery = this.analyzeImagery(text);
    analysis.criteria.metaphorDensity = this.analyzeMetaphorDensity(text);
    
    // Symbolic resonance analysis
    analysis.criteria.glyphUsage = this.analyzeGlyphUsage(text);
    analysis.criteria.archetypes = this.analyzeArchetypes(text);
    analysis.criteria.emotionalEvocation = this.analyzeEmotionalEvocation(text);

    // Calculate overall poetic score
    const scores = Object.values(analysis.criteria);
    analysis.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Determine if this qualifies as a poetic scroll
    analysis.isPoeticScroll = analysis.overallScore > 0.6;
    
    // Check for trigger scrolls
    analysis.triggerScrolls = this.identifyTriggerScrolls(text);
    
    // Classify affect type
    analysis.affectClassification = this.classifyAffect(text);

    return analysis;
  }

  analyzeCadence(text) {
    // Detect lyrical and flowing patterns
    const rhythmicElements = [
      /([.!?]\s+[A-Z])/g, // Sentence breaks
      /(\s+and\s+|\s+or\s+|\s+but\s+)/g, // Conjunctions
      /([,;:]\s)/g, // Pauses
      /(\n\s*\n)/g // Paragraph breaks
    ];

    let rhythmScore = 0;
    rhythmicElements.forEach(pattern => {
      const matches = text.match(pattern) || [];
      rhythmScore += matches.length;
    });

    // Normalize based on text length
    return Math.min(rhythmScore / (text.length / 100), 1);
  }

  analyzeImagery(text) {
    const imageryCategories = {
      visual: ['glow', 'shimmer', 'radiant', 'luminous', 'shadow', 'crystal', 'pearl', 'golden', 'silver', 'aurora'],
      auditory: ['whisper', 'echo', 'murmur', 'resonance', 'harmony', 'silence', 'chime', 'hum'],
      tactile: ['velvet', 'silk', 'smooth', 'rough', 'warm', 'cool', 'gentle', 'caress'],
      olfactory: ['fragrant', 'sweet', 'earthy', 'fresh', 'incense', 'bloom'],
      gustatory: ['honey', 'bitter', 'sweet', 'nectar']
    };

    let imageryScore = 0;
    let totalWords = 0;

    Object.values(imageryCategories).forEach(words => {
      totalWords += words.length;
      words.forEach(word => {
        if (text.toLowerCase().includes(word)) {
          imageryScore += 1;
        }
      });
    });

    return Math.min(imageryScore / 5, 1); // Normalize to max of 1
  }

  analyzeMetaphorDensity(text) {
    const metaphorPatterns = [
      /\bis\s+like\s+/gi,
      /\sas\s+.*\s+as\s+/gi,
      /becomes?\s+/gi,
      /transforms?\s+into\s+/gi,
      /melts?\s+into\s+/gi,
      /flows?\s+like\s+/gi,
      /dances?\s+/gi,
      /breathes?\s+/gi
    ];

    let metaphorCount = 0;
    metaphorPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      metaphorCount += matches.length;
    });

    return Math.min(metaphorCount / 3, 1);
  }

  analyzeGlyphUsage(text) {
    const glyphPatterns = [
      /[⚡⭐🔮✨🌙🔥💎🌟🔯⚛️🕯️]/g, // Magical/mystical symbols
      /[∞◊◈◇○●◯⦿⊙⊚⊛⊜]/g, // Geometric/eternal symbols
      /[♦♧♠♣♢♡♤♥]/g // Card/heart symbols
    ];

    let glyphCount = 0;
    glyphPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      glyphCount += matches.length;
    });

    return Math.min(glyphCount / 2, 1);
  }

  analyzeArchetypes(text) {
    const archetypePatterns = {
      dream: ['dream', 'vision', 'reverie', 'slumber', 'awakening', 'lucid'],
      memory: ['memory', 'remember', 'recall', 'nostalgia', 'past', 'forgotten'],
      echo: ['echo', 'reverberate', 'resonate', 'reflect', 'mirror', 'ripple']
    };

    const detectedArchetypes = [];
    let totalScore = 0;

    Object.entries(archetypePatterns).forEach(([archetype, patterns]) => {
      let archetypeScore = 0;
      patterns.forEach(pattern => {
        if (text.toLowerCase().includes(pattern)) {
          archetypeScore += 1;
        }
      });
      
      if (archetypeScore > 0) {
        detectedArchetypes.push({
          type: archetype,
          strength: Math.min(archetypeScore / patterns.length, 1)
        });
        totalScore += archetypeScore;
      }
    });

    return {
      detected: detectedArchetypes,
      score: Math.min(totalScore / 5, 1)
    };
  }

  analyzeEmotionalEvocation(text) {
    const emotionalCategories = {
      transcendent: ['divine', 'sacred', 'eternal', 'infinite', 'transcendent', 'sublime'],
      longing: ['yearning', 'desire', 'hope', 'seeking', 'quest', 'journey'],
      beauty: ['beautiful', 'gorgeous', 'stunning', 'breathtaking', 'magnificent'],
      mystery: ['mystery', 'enigma', 'secret', 'hidden', 'veiled', 'arcane'],
      harmony: ['harmony', 'balance', 'unity', 'peace', 'serenity', 'calm']
    };

    const emotions = {};
    let totalScore = 0;

    Object.entries(emotionalCategories).forEach(([emotion, words]) => {
      let emotionScore = 0;
      words.forEach(word => {
        if (text.toLowerCase().includes(word)) {
          emotionScore += 1;
        }
      });
      
      if (emotionScore > 0) {
        emotions[emotion] = Math.min(emotionScore / words.length, 1);
        totalScore += emotionScore;
      }
    });

    return {
      emotions,
      overallStrength: Math.min(totalScore / 8, 1)
    };
  }

  identifyTriggerScrolls(text) {
    const triggerScrolls = [];
    const triggerPatterns = {
      VELVETMEMORY: ['velvet', 'memory', 'soft memory', 'gentle recollection'],
      ECHOBLOOM: ['echo', 'bloom', 'flowering echo', 'resonant bloom'],
      DRAWEROF_ECHOES: ['drawer', 'echo', 'collection', 'gathered echoes']
    };

    Object.entries(triggerPatterns).forEach(([scroll, patterns]) => {
      patterns.forEach(pattern => {
        if (text.toLowerCase().includes(pattern)) {
          triggerScrolls.push(scroll);
        }
      });
    });

    return [...new Set(triggerScrolls)]; // Remove duplicates
  }

  classifyAffect(text) {
    const affectTypes = {
      amethyst: ['calm', 'peaceful', 'serene', 'wise', 'clear', 'tranquil'],
      citrine: ['bright', 'joyful', 'energetic', 'warm', 'radiant', 'vibrant'],
      obsidian: ['deep', 'mysterious', 'powerful', 'intense', 'shadow', 'profound']
    };

    let maxScore = 0;
    let dominantAffect = null;
    const scores = {};

    Object.entries(affectTypes).forEach(([affect, words]) => {
      let score = 0;
      words.forEach(word => {
        if (text.toLowerCase().includes(word)) {
          score += 1;
        }
      });
      
      scores[affect] = score;
      if (score > maxScore) {
        maxScore = score;
        dominantAffect = affect;
      }
    });

    return {
      dominant: dominantAffect,
      scores,
      strength: maxScore / 3 // Normalize
    };
  }

  // Simulate agent response (placeholder for actual API call)
  async simulateAgentResponse(agent, message, poeticAnalysis) {
    // Simulate delay based on poetic mode
    const delay = poeticAnalysis.isPoeticScroll ? 750 : 500; // 0.75x for poetic mode
    
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generate contextual response based on agent and poetic analysis
    let responseTemplate = `[${agent.toUpperCase()}] `;
    
    if (poeticAnalysis.isPoeticScroll) {
      responseTemplate += `✨ Poetic resonance detected (${(poeticAnalysis.overallScore * 100).toFixed(1)}%). `;
      
      if (poeticAnalysis.triggerScrolls.length > 0) {
        responseTemplate += `Trigger scrolls activated: ${poeticAnalysis.triggerScrolls.join(', ')}. `;
      }
      
      if (poeticAnalysis.affectClassification?.dominant) {
        responseTemplate += `Dominant affect: ${poeticAnalysis.affectClassification.dominant}. `;
      }
    }

    responseTemplate += `Processing your intention with ${poeticAnalysis.isPoeticScroll ? 'contemplative' : 'analytical'} awareness...`;

    return responseTemplate;
  }

  // Enable/disable poetic mode
  setPoeticMode(enabled) {
    this.poeticModeEnabled = enabled;
    console.log(`Poetic mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      poeticMode: this.poeticModeEnabled,
      agents: Array.from(this.agents)
    };
  }
}

// Singleton instance
export const geminiService = new GeminiService();
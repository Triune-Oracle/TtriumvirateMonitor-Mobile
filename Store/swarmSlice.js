import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agents: {
    oracle: { active: true, performance: 0.85, lastPing: Date.now() },
    capri: { active: true, performance: 0.92, lastPing: Date.now() },
    gemini: { active: true, performance: 0.78, lastPing: Date.now() },
    aria: { active: true, performance: 0.88, lastPing: Date.now() },
    conjuror: { active: true, performance: 0.81, lastPing: Date.now() },
  },
  // Poetic Mode Extensions
  poeticMode: {
    activeScrolls: [],
    resonanceMetrics: {
      echoDepth: {},
      resonantDrift: {},
      affectFootprint: {},
      lanternOfferings: []
    },
    poeticModeActive: false,
    currentScrollResonance: null,
    activeModeAgents: []
  },
  // Extension configuration
  extensions: {
    AGENTMODEPOETICLAYER: {
      extensionid: "AGENTMODEPOETICLAYER",
      applies_to: ["Oracle", "Capri", "Gemini", "Aria", "Conjuror"],
      triggerscrolls: ["VELVETMEMORY", "ECHOBLOOM", "DRAWEROF_ECHOES"],
      activationcondition: "Scroll with poeticaffect:true invoked within Dream Socket or Codex Engine",
      tone_shift: {
        language_register: "Lyrical-Reflective",
        visual_interface: "Soft glyph pulses, aurora overlays, handwritten sigil fragments",
        behavior_adjustments: {
          prompt_style: "Metaphorical + Sensory Anchored",
          response_delay: "0.75x normal (to simulate contemplative breath)",
          gesture_resonance: "Ripple bloom upon touch; scroll sigh upon exit"
        }
      }
    }
  }
};

const swarmSlice = createSlice({
  name: 'swarm',
  initialState,
  reducers: {
    updateAgentPerformance: (state, action) => {
      const { agent, performance } = action.payload;
      if (state.agents[agent]) {
        state.agents[agent].performance = performance;
        state.agents[agent].lastPing = Date.now();
      }
    },
    toggleAgentActive: (state, action) => {
      const { agent } = action.payload;
      if (state.agents[agent]) {
        state.agents[agent].active = !state.agents[agent].active;
      }
    },
    // Poetic Mode Actions
    togglePoeticMode: (state, action) => {
      const { agent } = action.payload;
      if (agent) {
        // Toggle for specific agent
        const index = state.poeticMode.activeModeAgents.indexOf(agent);
        if (index > -1) {
          state.poeticMode.activeModeAgents.splice(index, 1);
        } else {
          state.poeticMode.activeModeAgents.push(agent);
        }
      } else {
        // Toggle global poetic mode
        state.poeticMode.poeticModeActive = !state.poeticMode.poeticModeActive;
      }
    },
    addActiveScroll: (state, action) => {
      const { scroll } = action.payload;
      state.poeticMode.activeScrolls.push({
        ...scroll,
        timestamp: Date.now(),
        echoDepth: 1
      });
    },
    updateScrollResonance: (state, action) => {
      const { scrollId, resonanceData } = action.payload;
      state.poeticMode.currentScrollResonance = {
        scrollId,
        ...resonanceData,
        timestamp: Date.now()
      };
    },
    updateResonanceMetrics: (state, action) => {
      const { type, agent, value } = action.payload;
      if (!state.poeticMode.resonanceMetrics[type]) {
        state.poeticMode.resonanceMetrics[type] = {};
      }
      state.poeticMode.resonanceMetrics[type][agent] = value;
    },
    addLanternOffering: (state, action) => {
      const offering = {
        ...action.payload,
        timestamp: Date.now()
      };
      state.poeticMode.resonanceMetrics.lanternOfferings.push(offering);
      // Keep only last 50 offerings
      if (state.poeticMode.resonanceMetrics.lanternOfferings.length > 50) {
        state.poeticMode.resonanceMetrics.lanternOfferings.shift();
      }
    },
    clearScrollEchoes: (state) => {
      state.poeticMode.activeScrolls = [];
      state.poeticMode.currentScrollResonance = null;
    }
  },
});

export const {
  updateAgentPerformance,
  toggleAgentActive,
  togglePoeticMode,
  addActiveScroll,
  updateScrollResonance,
  updateResonanceMetrics,
  addLanternOffering,
  clearScrollEchoes
} = swarmSlice.actions;

export default swarmSlice.reducer;
# TriumvirateMonitor Mobile

A React Native mobile application for monitoring and managing the Triumvirate AI Swarm system.

## Overview


### AI Agents Monitored
- **Oracle**: the Vision
- **Capri**: the Executor  
- **Gemini**: the Strategist
- **Aria**: the Collaborator
- **Conjuror**: the Catalyst


**Primary Languages:** JavaScript, JSX  
**Framework:** React Native with Expo  
**State Management:** Redux Toolkit with SQLite persistence  
**UI Components:** React Native SVG, Charts  
**Platform:** Cross-platform mobile (iOS/Android)

## Features

- Real-time AI agent performance monitoring
- Interactive charts and data visualization
- Swarm synchronization capabilities
- Persistent data storage
- Custom symbolic UI elements

## Installation

```bash
npm install --global eas-cli
npx create-expo-app triumviratemonitor-mobile
cd triumviratemonitor-mobile
eas init --id <your-expo-project-id>
npm install
```

## Getting Started

```bash
npm start
# or
expo start
```

## Project Structure

- `app/` - Application entry point and routing
- `components/` - Reusable UI components
- `screens/` - Application screens and views
- `navigation/` - Navigation configuration
- `Store/` - Redux store and state management
- `assets/` - Static assets and resources

## License

This project is licensed under the terms specified in the LICENSE file.

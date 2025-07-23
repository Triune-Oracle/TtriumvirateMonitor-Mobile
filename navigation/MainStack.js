import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ScrollResonanceScreen from '../screens/ScrollResonanceScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#00ffcc',
          headerTitleStyle: { 
            fontFamily: 'monospace',
            fontSize: 16,
            fontWeight: 'bold'
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'TRIUMVIRATE MONITOR',
          }}
        />
        <Stack.Screen 
          name="ScrollResonance" 
          component={ScrollResonanceScreen}
          options={{
            title: 'SCROLL ECHO METRICS',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

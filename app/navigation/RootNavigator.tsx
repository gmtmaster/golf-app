// app/navigation/RootNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

import WelcomeScreen from '../screens/WelcomeScreen';
import TrackSessionScreen from '../screens/TrackSessionScreen';
import PressureGameScreen from '../screens/PressureGameScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: '#222',
                    height: 70,
                },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.subtext,
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
                    if (route.name === 'Welcome') iconName = 'home-outline';
                    if (route.name === 'Track') iconName = 'golf';
                    if (route.name === 'Stats') iconName = 'bar-chart-outline';
                    if (route.name === 'Pressure') iconName = 'stopwatch-outline';
                    if (route.name === 'Settings') iconName = 'settings-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
            })}
        >
            <Tab.Screen name="Welcome" component={WelcomeScreen} />
            <Tab.Screen name="Track" component={TrackSessionScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Pressure" component={PressureGameScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

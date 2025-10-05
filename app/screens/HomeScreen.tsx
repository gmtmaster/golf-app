import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={typography.title}>Trackman Companion</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('TrackSession')}
            >
                <Ionicons name="golf" size={20} color="white" />
                <Text style={styles.buttonText}>Track Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PressureGame')}
            >
                <Ionicons name="stopwatch" size={20} color="white" />
                <Text style={styles.buttonText}>Pressure Game</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Stats')}
            >
                <Ionicons name="bar-chart" size={20} color="white" />
                <Text style={styles.buttonText}>Statistics</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.surface }]}
                onPress={() => navigation.navigate('Settings')}
            >
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 10,
    },
    buttonText: {
        ...typography.subtitle,
        color: COLORS.text,
    },
});

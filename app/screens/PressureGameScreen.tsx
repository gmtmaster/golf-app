import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';

export default function PressureGameScreen() {
    const [gameActive, setGameActive] = useState(false);
    const [round, setRound] = useState(0);
    const [target, setTarget] = useState<number | null>(null);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [lastScore, setLastScore] = useState<number | null>(null);

    // új target generálása
    const newTarget = () => Math.floor(Math.random() * 100) + 40; // 40–140 m

    const startGame = () => {
        setGameActive(true);
        setRound(1);
        setScore(0);
        setLastScore(null);
        setTarget(newTarget());
        setInput('');
    };

    const handleShot = () => {
        if (!input || !target) return;

        const actual = Number(input);
        const diff = Math.abs(actual - target);
        const points = Math.max(0, 10 - diff / 2); // pontszám logika

        setScore((prev) => prev + points);
        setLastScore(points);

        if (round < 10) {
            setRound(round + 1);
            setTarget(newTarget());
            setInput('');
        } else {
            // vége a játéknak
            setGameActive(false);
            alert(`🏁 Game Over!\nTotal Score: ${Math.round(score + points)} pts`);
            setRound(0);
            setTarget(null);
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={typography.title}>Pressure Game</Text>

            {!gameActive ? (
                <View style={styles.center}>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Text style={styles.startText}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.gameArea}>
                    <Text style={styles.roundText}>Shot {round} / 10</Text>

                    <Text style={styles.targetLabel}>Target Distance</Text>
                    <Text style={styles.targetValue}>{target} m</Text>

                    <Text style={styles.hitLabel}>Your Shot</Text>
                    <TextInput
                        style={styles.hitInput}
                        placeholder="0"
                        placeholderTextColor="#444"
                        keyboardType="numeric"
                        value={input}
                        onChangeText={setInput}
                        textAlign="center"
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleShot}>
                        <Text style={styles.submitText}>Submit Shot</Text>
                    </TouchableOpacity>

                    {lastScore !== null && (
                        <Text style={styles.lastScore}>
                            Last Shot: {lastScore.toFixed(1)} pts
                        </Text>
                    )}

                    <Text style={styles.totalScore}>
                        Total Score: {score.toFixed(1)} pts
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameArea: {
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 14,

    },
    startText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '700',
    },
    roundText: {
        color: COLORS.subtext,
        marginBottom: 8,
    },
    targetLabel: {
        color: COLORS.subtext,
        fontSize: 14,
    },
    targetValue: {
        color: COLORS.text,
        fontSize: 42,
        fontWeight: '700',
        marginVertical: 10,
    },
    hitLabel: {
        color: COLORS.subtext,
        marginTop: 20,
    },
    hitInput: {
        color: COLORS.text,
        fontSize: 64,
        fontWeight: '700',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        width: 200,
        height: 110,
        marginVertical: 20,
    },
    submitButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 60,
    },
    submitText: {
        color: COLORS.text,
        fontWeight: '700',
        fontSize: 16,
    },
    lastScore: {
        color: COLORS.subtext,
        marginTop: 16,
    },
    totalScore: {
        color: COLORS.text,
        fontWeight: '700',
        fontSize: 18,
        marginTop: 4,
    },
});

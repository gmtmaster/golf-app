import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { COLORS } from "../theme/colors";
import { typography } from "../theme/typography";
import { AuthContext } from "../context/AuthContext";

export default function SettingsScreen() {
    const { logout } = useContext(AuthContext); // 👈 innen jön a logout

    const handleLogout = () => {
        Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await logout(); // ✅ ez törli a tokent és reseteli az appot
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={typography.title}>Settings</Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Sync with Cloud</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.error }]}>
                <Text style={styles.text}>Clear Local Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.logoutBtn]} onPress={handleLogout}>
                <Text style={[styles.text, { color: COLORS.text }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        paddingTop: 80,
    },
    button: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
    },
    logoutBtn: {
        backgroundColor: COLORS.accent,
    },
    text: {
        color: COLORS.text,
        fontWeight: "600",
        textAlign: "center",
    },
});

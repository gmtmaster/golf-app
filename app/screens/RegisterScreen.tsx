import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Alert,
} from "react-native";
import { COLORS } from "../theme/colors";
import { typography } from "../theme/typography";
import { register } from "../lib/api";

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const res = await register(name, email, password);
            if (res.token) {
                navigation.reset({ index: 0, routes: [{ name: "Root" }] });
            } else {
                Alert.alert("Error", res.error || "Registration failed");
            }
        } catch {
            Alert.alert("Error", "Registration failed");
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/bg-login.jpg")}
            style={styles.bg}
            resizeMode="cover"
            blurRadius={3}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={typography.title}>Create Account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor={COLORS.subtext}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={COLORS.subtext}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={COLORS.subtext}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.switchText}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.0)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        backgroundColor: "rgba(26,26,26,0.9)",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
    },
    input: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.08)",
        color: COLORS.text,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 8,
    },
    button: {
        width: "100%",
        backgroundColor: COLORS.accent,
        borderRadius: 12,
        alignItems: "center",
        paddingVertical: 14,
        marginTop: 12,
    },
    buttonText: {
        color: COLORS.text,
        fontWeight: "700",
        fontSize: 16,
    },
    switchText: {
        color: COLORS.subtext,
        marginTop: 16,
    },
});

import React, { useState, useContext } from "react";
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
import { login as loginApi } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext); // 🔥 contextből login()

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await loginApi(email, password);

            if (res.token) {
                await login(res.token); // ✅ frissíti a contextet + menti SecureStore-ba
                // nincs manuális navigáció – App.tsx újrarenderel RootNavigatorre
            } else {
                Alert.alert("Login failed", res.error || "Unknown error");
            }
        } catch (err) {
            console.error("LOGIN ERROR", err);
            Alert.alert("Error", "Could not log in");
        } finally {
            setLoading(false);
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
                    <Text style={typography.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={COLORS.subtext}
                        autoCapitalize="none"
                        keyboardType="email-address"
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

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Loading..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                    {/* ha van külön regisztráció képernyő */}
                    {/* <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.switchText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity> */}
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
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    subtitle: {
        color: COLORS.subtext,
        marginBottom: 20,
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

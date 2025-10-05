import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { getCurrentUser, logout } from "../lib/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function WelcomeScreen({ navigation }: any) {
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const u = await getCurrentUser();
                if (u?.email) {
                    setUser(u);
                } else {
                    await logout();
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                }
            } catch {
                await logout();
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="#22d3ee" size="large" />
            </View>
        );
    }

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-white text-2xl font-bold mb-1">Session expired</Text>
                <Text className="text-gray-400">Please log in again</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require("../../assets/bg-login.jpg")}
            className="flex-1"
            resizeMode="cover"
            blurRadius={1}
        >
            <View className="flex-1 items-center justify-center bg-black/10 px-6">
                <Animated.View
                    entering={FadeInUp.duration(600).springify()}
                    className="w-full bg-black/70 rounded-2xl px-6 py-10 items-center border border-white/20 shadow-xl"
                >
                    <MaterialCommunityIcons
                        name="golf-tee"
                        size={40}
                        color="#FF7A00"
                        style={{ marginBottom: 10 }}
                    />

                    <Text className="text-[#FF7A00] text-lg font-semibold mb-1">
                        Welcome back
                    </Text>
                    <Text className="text-white text-3xl font-bold">{user.name} 👋</Text>
                    <Text className="text-gray-300 text-sm mb-5">{user.email}</Text>

                    <View className="w-20 h-px bg-white/20 mb-4" />

                    <Text className="text-white/90 text-center leading-6 mb-8">
                        Track your stats, master pressure games{"\n"}and improve your swing every day.
                    </Text>

                    <TouchableOpacity
                        className="flex-row items-center bg-[#FF7A00] px-6 py-3 rounded-xl active:opacity-80"
                        onPress={() => navigation.navigate("Dashboard")}
                    >
                        <MaterialCommunityIcons name="chart-line" color="#fff" size={20} />
                        <Text className="text-white font-semibold text-base ml-2">
                            Go to Dashboard
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View
                    entering={FadeInUp.delay(200).duration(600).springify()}
                    className="w-full bg-black/70 rounded-2xl mt-6 p-5 border border-white/20 shadow-lg"
                >
                    <Text className="text-white font-semibold text-lg mb-3">Your Stats</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center flex-1">
                            <MaterialCommunityIcons name="golf" size={28} color="#FF7A00" />
                            <Text className="text-white text-xl font-bold mt-1">72</Text>
                            <Text className="text-gray-400 text-xs">Avg Score</Text>
                        </View>
                        <View className="items-center flex-1">
                            <MaterialCommunityIcons name="target" size={28} color="#FF7A00" />
                            <Text className="text-white text-xl font-bold mt-1">14</Text>
                            <Text className="text-gray-400 text-xs">Pressure Rounds</Text>
                        </View>
                        <View className="items-center flex-1">
                            <MaterialCommunityIcons name="chart-line" size={28} color="#FF7A00" />
                            <Text className="text-white text-xl font-bold mt-1">+8%</Text>
                            <Text className="text-gray-400 text-xs">Improvement</Text>
                        </View>
                    </View>
                </Animated.View>
                <View className="w-full mt-8 flex-row justify-between">
                    <TouchableOpacity className="items-center bg-black/70 p-4 border border-white/20 rounded-xl flex-1 mx-1 active:opacity-70">
                        <MaterialCommunityIcons name="flag-checkered" size={26} color="#FF7A00" />
                        <Text className="text-white text-xs mt-1">Practice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center bg-black/70 p-4 border border-white/20 rounded-xl flex-1 mx-1 active:opacity-70">
                        <MaterialCommunityIcons name="chart-bar" size={26} color="#FF7A00" />
                        <Text className="text-white text-xs mt-1">Stats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center bg-black/70 p-4 border border-white/20 rounded-xl flex-1 mx-1 active:opacity-70">
                        <MaterialCommunityIcons name="trophy" size={26} color="#FF7A00" />
                        <Text className="text-white text-xs mt-1">Leaderboard</Text>
                    </TouchableOpacity>
                </View>



                <Text className="absolute bottom-8 text-gray-400 text-xs">
                    v1.0 • Trackman Companion
                </Text>
            </View>
        </ImageBackground>
    );
}

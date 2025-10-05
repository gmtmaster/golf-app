// app/screens/TrackSessionScreen.tsx
import React, { useState } from "react";
import { saveShot } from "../lib/api";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

const CLUBS = [
    "Driver",
    "3 Wood",
    "5 Iron",
    "6 Iron",
    "7 Iron",
    "8 Iron",
    "9 Iron",
    "Pitching Wedge",
    "Sand Wedge",
];
const IMPACTS = ["Solid", "Thin", "Fat", "Toe", "Heel"];

export default function TrackSessionScreen() {
    const [club, setClub] = useState("7 Iron");
    const [impact, setImpact] = useState("Solid");

    // Fields
    const [carry, setCarry] = useState("");
    const [total, setTotal] = useState("");
    const [ballSpeed, setBallSpeed] = useState("");
    const [clubSpeed, setClubSpeed] = useState("");
    const [smash, setSmash] = useState("");
    const [launchDeg, setLaunchDeg] = useState("");
    const [spin, setSpin] = useState("");
    const [offlineM, setOfflineM] = useState("");

    const [clubPickerVisible, setClubPickerVisible] = useState(false);
    const [impactPickerVisible, setImpactPickerVisible] = useState(false);

    const handleAddShot = async () => {
        if (!carry) return;

        const shotData = {
            club,
            carry: parseFloat(carry),
            total: total ? parseFloat(total) : null,
            ballSpeed: ballSpeed ? parseFloat(ballSpeed) : null,
            clubSpeed: clubSpeed ? parseFloat(clubSpeed) : null,
            smash: smash ? parseFloat(smash) : null,
            launchDeg: launchDeg ? parseFloat(launchDeg) : null,
            spin: spin ? parseInt(spin) : null,
            offlineM: offlineM ? parseFloat(offlineM) : null,
            result: impact,
        };

        try {
            const res = await saveShot(shotData);
            console.log("✅ Shot saved:", res);
            setCarry("");
            setTotal("");
            setBallSpeed("");
            setClubSpeed("");
            setSmash("");
            setLaunchDeg("");
            setSpin("");
            setOfflineM("");
        } catch (err) {
            console.error("💥 saveShot error:", err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-neutral-950"
        >
            {/* Gradient header */}
            <LinearGradient
                colors={["#f59e0b", "#f97316", "#c2410c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 pt-16 pb-10 rounded-b-3xl"
            >
                <Text className="text-white font-bold text-2xl mb-1 mt-10 pt-8 ml-4">Track Session</Text>
                <Text className="text-emerald-100 text-sm ml-4">
                    Log your shots and monitor your consistency.
                </Text>

                {/* Active club + impact summary */}
                <View className="flex-row mt-6 space-x-4 justify-center gap-6 mb-4">
                    <TouchableOpacity
                        className="bg-white/20 border border-white/20 px-4 py-2 rounded-full"
                        onPress={() => setClubPickerVisible(true)}
                    >
                        <Text className="text-white font-semibold">{club}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white/10 border border-white/20 px-4 py-2 rounded-full"
                        onPress={() => setImpactPickerVisible(true)}
                    >
                        <Text className="text-white font-semibold">{impact}</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Body */}
            <ScrollView
                className="flex-1 px-5 pt-6 pb-10"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.delay(200)}>
                    <Text className="text-lg font-bold text-white mb-4">Shot Metrics</Text>

                    <View className="flex flex-col gap-4">
                        {[
                            { label: "Carry (m)", value: carry, setter: setCarry },
                            { label: "Total (m)", value: total, setter: setTotal },
                            { label: "Ball Speed (km/h)", value: ballSpeed, setter: setBallSpeed },
                            { label: "Club Speed (km/h)", value: clubSpeed, setter: setClubSpeed },
                            { label: "Smash Factor", value: smash, setter: setSmash },
                            { label: "Launch Angle (°)", value: launchDeg, setter: setLaunchDeg },
                            { label: "Spin (rpm)", value: spin, setter: setSpin },
                            { label: "Offline (m)", value: offlineM, setter: setOfflineM },
                        ].map((f, index) => (
                            <Animated.View
                                key={f.label}
                                entering={FadeInUp.delay(index * 50)}
                                className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4"
                            >
                                <Text className="text-neutral-400 mb-2 text-sm">{f.label}</Text>
                                <TextInput
                                    className="text-white text-lg font-semibold"
                                    placeholder={f.label}
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    value={f.value}
                                    onChangeText={f.setter}
                                />
                            </Animated.View>
                        ))}
                    </View>

                    {/* Add Shot Button */}
                    <TouchableOpacity
                        onPress={handleAddShot}
                        className="mt-8 rounded-2xl overflow-hidden"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#f59e0b", "#f97316"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="py-4 mb-6"
                        >
                            <Text className="text-center text-white font-bold py-4 text-lg tracking-wide">
                                Add Shot
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Club Picker */}
            <Modal visible={clubPickerVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-neutral-900/95 p-5 rounded-t-2xl border-t border-neutral-800">
                        <Text className="text-white text-lg font-bold mb-2 text-center">
                            Select Club
                        </Text>
                        {CLUBS.map((c) => (
                            <Pressable
                                key={c}
                                className="py-3 border-b border-neutral-800"
                                onPress={() => {
                                    setClub(c);
                                    setClubPickerVisible(false);
                                }}
                            >
                                <Text className="text-white text-center text-base">{c}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setClubPickerVisible(false)}>
                            <Text className="text-emerald-400 text-center mt-4 font-bold">
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Impact Picker */}
            <Modal visible={impactPickerVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-neutral-900/95 p-5 rounded-t-2xl border-t border-neutral-800">
                        <Text className="text-white text-lg font-bold mb-2 text-center">
                            Impact Quality
                        </Text>
                        {IMPACTS.map((i) => (
                            <Pressable
                                key={i}
                                className="py-3 border-b border-neutral-800"
                                onPress={() => {
                                    setImpact(i);
                                    setImpactPickerVisible(false);
                                }}
                            >
                                <Text className="text-white text-center text-base">{i}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setImpactPickerVisible(false)}>
                            <Text className="text-emerald-400 text-center mt-4 font-bold">
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

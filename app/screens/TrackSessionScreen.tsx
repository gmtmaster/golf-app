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
        console.log("🟢 handleAddShot called!");

        if (!carry) {
            console.log("⚠️ Nincs carry érték, nem küldjük el");
            return;
        }

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
            console.log("📬 saveShot válasz:", res);

            if (res?.error) console.log("❌ Shot mentés sikertelen:", res.error);
            else console.log("✅ Shot mentve:", res);

            // reset fields
            setCarry("");
            setTotal("");
            setBallSpeed("");
            setClubSpeed("");
            setSmash("");
            setLaunchDeg("");
            setSpin("");
            setOfflineM("");
        } catch (err) {
            console.error("💥 Hiba a saveShot alatt:", err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-neutral-950 px-5 pt-16 pb-5"
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-2xl font-bold text-white mb-1">Track Shot</Text>
                <Text className="text-neutral-400 mb-4">
                    Enter your golf shot data below.
                </Text>

                {/* Club selector */}
                <TouchableOpacity
                    className="bg-neutral-900 rounded-xl p-3 mb-3"
                    onPress={() => setClubPickerVisible(true)}
                >
                    <Text className="text-xs text-neutral-400">Club</Text>
                    <Text className="text-lg font-semibold text-white mt-1">{club}</Text>
                </TouchableOpacity>

                {/* Impact selector */}
                <TouchableOpacity
                    className="bg-neutral-900 rounded-xl p-3 mb-3"
                    onPress={() => setImpactPickerVisible(true)}
                >
                    <Text className="text-xs text-neutral-400">Impact</Text>
                    <Text className="text-lg font-semibold text-white mt-1">{impact}</Text>
                </TouchableOpacity>

                {/* Input fields */}
                <View className="flex flex-col gap-3 mt-2">
                    {[
                        { label: "Carry (m)", value: carry, setter: setCarry },
                        { label: "Total (m)", value: total, setter: setTotal },
                        { label: "Ball Speed (km/h)", value: ballSpeed, setter: setBallSpeed },
                        { label: "Club Speed (km/h)", value: clubSpeed, setter: setClubSpeed },
                        { label: "Smash Factor", value: smash, setter: setSmash },
                        { label: "Launch Angle (°)", value: launchDeg, setter: setLaunchDeg },
                        { label: "Spin (rpm)", value: spin, setter: setSpin },
                        { label: "Offline (m)", value: offlineM, setter: setOfflineM },
                    ].map((f) => (
                        <View key={f.label}>
                            <Text className="text-neutral-400 mb-1">{f.label}</Text>
                            <TextInput
                                className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                                placeholder={f.label}
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={f.value}
                                onChangeText={f.setter}
                            />
                        </View>
                    ))}
                </View>

                {/* Add button */}
                <TouchableOpacity
                    onPress={handleAddShot}
                    className="bg-emerald-500 rounded-2xl py-4 mt-6"
                >
                    <Text className="text-white font-bold text-lg text-center">Add Shot</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Club Picker */}
            <Modal visible={clubPickerVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-neutral-900 p-5 rounded-t-2xl">
                        <Text className="text-white text-lg font-bold mb-2">Select Club</Text>
                        {CLUBS.map((c) => (
                            <Pressable
                                key={c}
                                className="py-2"
                                onPress={() => {
                                    setClub(c);
                                    setClubPickerVisible(false);
                                }}
                            >
                                <Text className="text-white text-base">{c}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setClubPickerVisible(false)}>
                            <Text className="text-emerald-400 text-center mt-3 font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Impact Picker */}
            <Modal visible={impactPickerVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-neutral-900 p-5 rounded-t-2xl">
                        <Text className="text-white text-lg font-bold mb-2">Impact Quality</Text>
                        {IMPACTS.map((i) => (
                            <Pressable
                                key={i}
                                className="py-2"
                                onPress={() => {
                                    setImpact(i);
                                    setImpactPickerVisible(false);
                                }}
                            >
                                <Text className="text-white text-base">{i}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setImpactPickerVisible(false)}>
                            <Text className="text-emerald-400 text-center mt-3 font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

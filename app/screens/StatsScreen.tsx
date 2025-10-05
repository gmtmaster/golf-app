import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { getToken } from "../lib/secureStore";
import { BarChart, LineChart } from "react-native-chart-kit";

export default function StatsScreen() {
    const [clubs, setClubs] = useState<string[]>([]);
    const [selectedClub, setSelectedClub] = useState<string | null>(null);
    const [shots, setShots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pickerVisible, setPickerVisible] = useState(false);

    const screenWidth = Dimensions.get("window").width - 40;

    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();

            // fetch clubs
            const clubRes = await fetch("https://trackman-cloud.vercel.app/api/mobile/clubs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const clubData = await clubRes.json();
            setClubs(clubData.clubs || []);

            // fetch shots
            const shotRes = await fetch("https://trackman-cloud.vercel.app/api/mobile/shots", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const shotData = await shotRes.json();
            setShots(shotData.shots || []);
            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredShots = useMemo(() => {
        if (!selectedClub) return [];
        return shots.filter((s) => s.club === selectedClub);
    }, [shots, selectedClub]);

    const stats = useMemo(() => {
        if (filteredShots.length === 0) return null;

        const totals = filteredShots.map((s) => s.total || 0);
        const carries = filteredShots.map((s) => s.carry || 0);

        const avgTotal = (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1);
        const avgCarry = (carries.reduce((a, b) => a + b, 0) / carries.length).toFixed(1);
        const max = Math.max(...totals);
        const min = Math.min(...totals);

        return { avgTotal, avgCarry, max, min, totals, carries };
    }, [filteredShots]);

    const formatClubName = (value: string) => {
        return value
            .replace("WOOD_", "")
            .replace("IRON_", "")
            .replace("PW", "Pitching Wedge")
            .replace("SW", "Sand Wedge")
            .replace("DRIVER", "Driver")
            .trim()
            .replace(/^(\d+)$/, "$1 Iron");
    };

    const chartConfig = {
        backgroundGradientFrom: "#171717",
        backgroundGradientTo: "#171717",
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        labelColor: () => "#aaa",
        decimalPlaces: 0,
        barPercentage: 0.5,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#10b981",
        },
    };

    return (
        <View className="flex-1 bg-neutral-950 px-5 pt-16 pb-5">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator color="#10b981" size="large" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-2xl font-bold text-white mb-5">Session Stats</Text>

                    {/* Club selector */}
                    <TouchableOpacity
                        className="bg-neutral-900 rounded-xl p-4 mb-6"
                        onPress={() => setPickerVisible(true)}
                    >
                        <Text className="text-xs text-neutral-400">Club</Text>
                        <Text className="text-lg font-semibold text-white mt-1">
                            {selectedClub ? formatClubName(selectedClub) : "Select a Club"}
                        </Text>
                    </TouchableOpacity>

                    {stats ? (
                        <>
                            {/* Stat cards */}
                            <View className="flex-row justify-between mb-5">
                                {[
                                    { label: "AVG", value: `${stats.avgTotal}m` },
                                    { label: "MAX", value: `${stats.max}m` },
                                    { label: "MIN", value: `${stats.min}m` },
                                ].map((item) => (
                                    <View
                                        key={item.label}
                                        className="bg-neutral-900 rounded-2xl p-4 flex-1 mx-1 items-center"
                                    >
                                        <Text className="text-neutral-400 text-xs mb-1">{item.label}</Text>
                                        <Text className="text-white text-xl font-bold">{item.value}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Distance distribution */}
                            <View className="bg-neutral-900 rounded-2xl p-4 mb-6">
                                <Text className="text-white font-semibold mb-3 text-lg">
                                    Shot Distance Trend
                                </Text>
                                <LineChart
                                    data={{
                                        labels: filteredShots.map((_, i) => `${i + 1}`),
                                        datasets: [{ data: stats.totals }],
                                    }}
                                    width={screenWidth}
                                    height={220}
                                    yAxisSuffix="m"
                                    chartConfig={chartConfig}
                                    bezier
                                    style={{ borderRadius: 16 }}
                                />
                            </View>

                            {/* Carry vs Total Comparison */}
                            <View className="bg-neutral-900 rounded-2xl p-4 mb-6">
                                <Text className="text-white font-semibold mb-3 text-lg">
                                    Carry vs Total Averages
                                </Text>
                                <BarChart
                                    data={{
                                        labels: ["Carry Avg", "Total Avg"],
                                        datasets: [
                                            { data: [Number(stats.avgCarry), Number(stats.avgTotal)] },
                                        ],
                                    }}
                                    width={screenWidth}
                                    height={220}
                                    yAxisSuffix="m"
                                    fromZero
                                    showValuesOnTopOfBars
                                    chartConfig={{
                                        ...chartConfig,
                                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                    }}
                                    style={{ borderRadius: 16 }}
                                />
                            </View>

                            {/* Consistency Score */}
                            <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
                                <Text className="text-emerald-400 font-semibold">
                                    Consistency Score:{" "}
                                    <Text className="text-white">
                                        {Math.max(
                                            0,
                                            (1 - (stats.max - stats.min) / Number(stats.avgTotal)) * 100
                                        ).toFixed(0)}
                                        %
                                    </Text>
                                </Text>
                                <Text className="text-neutral-400 text-xs mt-1">
                                    Based on your distance spread (max-min relative to average).
                                </Text>
                            </View>

                            {/* Recent shots */}
                            <View className="bg-neutral-900 rounded-2xl p-4 mb-8">
                                <Text className="text-white font-semibold mb-3 text-lg">
                                    Last Shots ({filteredShots.length})
                                </Text>
                                {filteredShots.slice(0, 5).map((s, i) => (
                                    <View
                                        key={i}
                                        className="flex-row justify-between border-b border-neutral-800 py-2"
                                    >
                                        <Text className="text-neutral-400 text-sm">#{i + 1}</Text>
                                        <Text className="text-white text-sm">
                                            {s.total ? `${s.total}m` : "-"}
                                        </Text>
                                        <Text className="text-neutral-500 text-sm">{s.result || "—"}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text className="text-neutral-500 text-center mt-10">
                            {selectedClub
                                ? "No shots recorded yet for this club."
                                : "Select a club to view stats."}
                        </Text>
                    )}
                </ScrollView>
            )}

            {/* Club picker */}
            <Modal visible={pickerVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-neutral-900 p-5 rounded-t-2xl">
                        <Text className="text-white text-lg font-bold mb-2">Select Club</Text>
                        {clubs.map((c) => (
                            <Pressable
                                key={c}
                                className="py-2"
                                onPress={() => {
                                    setSelectedClub(c);
                                    setPickerVisible(false);
                                }}
                            >
                                <Text className="text-white text-base">{formatClubName(c)}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setPickerVisible(false)}>
                            <Text className="text-emerald-400 text-center mt-3 font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

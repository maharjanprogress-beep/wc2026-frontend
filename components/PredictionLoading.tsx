import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

const MESSAGES = [
  "Analyzing squad form...",
  "Reviewing head-to-head records...",
  "Evaluating tactical setups...",
  "Assessing injury reports...",
  "Calculating win probabilities...",
  "Predicting goal scorers...",
  "Building starting lineups...",
  "Finalizing prediction...",
];

export function PredictionLoading() {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const [msgIndex, setMsgIndex] = React.useState(0);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1200);

    return () => {
      pulse.stop();
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.ball, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.ballEmoji}>⚽</Text>
      </View>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: colors.primary, opacity: pulseAnim },
              { transform: [{ scale: i === 1 ? 1.3 : 1 }] },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>AI Prediction in Progress</Text>
      <Text style={[styles.message, { color: colors.mutedForeground }]}>{MESSAGES[msgIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 20,
  },
  ball: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ballEmoji: {
    fontSize: 40,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});

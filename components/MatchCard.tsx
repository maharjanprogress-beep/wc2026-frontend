import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { TEAMS } from "@/constants/wcData";
import type { Match } from "@/constants/wcData";

interface Props {
  match: Match;
  onPress?: () => void;
  showPrediction?: boolean;
  prediction?: "home_win" | "draw" | "away_win";
  confidence?: number;
}

export function MatchCard({ match, onPress, showPrediction, prediction, confidence }: Props) {
  const colors = useColors();
  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];

  const isTBD = match.homeTeam.startsWith("TBD") || match.homeTeam.includes("/");

  const getPredictionLabel = () => {
    if (!prediction) return null;
    if (prediction === "home_win") return match.homeTeam;
    if (prediction === "away_win") return match.awayTeam;
    return "Draw";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.stageRow}>
        <Text style={[styles.stage, { color: colors.mutedForeground }]}>{match.stage}</Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>{match.date}</Text>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.team}>
          <Text style={styles.flag}>{homeTeam?.flag ?? "🏳️"}</Text>
          <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
            {isTBD ? match.homeTeam : (homeTeam?.name ?? match.homeTeam)}
          </Text>
        </View>

        <View style={[styles.vsBox, { backgroundColor: colors.muted }]}>
          <Text style={[styles.vs, { color: colors.mutedForeground }]}>VS</Text>
        </View>

        <View style={[styles.team, styles.teamRight]}>
          <Text style={styles.flag}>{awayTeam?.flag ?? "🏳️"}</Text>
          <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
            {isTBD ? match.awayTeam : (awayTeam?.name ?? match.awayTeam)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.venue, { color: colors.mutedForeground }]}>
          {match.city} · {match.venue}
        </Text>
        {showPrediction && prediction && confidence !== undefined && (
          <View style={[styles.predBadge, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
            <Text style={[styles.predText, { color: colors.primary }]}>
              {getPredictionLabel()} · {confidence}%
            </Text>
          </View>
        )}
        {!showPrediction && (
          <View style={[styles.predBadge, { backgroundColor: colors.accent + "20", borderColor: colors.accent + "40" }]}>
            <Text style={[styles.predText, { color: colors.accent }]}>Tap to predict</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  stageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stage: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  team: {
    flex: 1,
    alignItems: "flex-start",
    gap: 4,
  },
  teamRight: {
    alignItems: "flex-end",
  },
  flag: {
    fontSize: 28,
  },
  teamName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  vsBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  vs: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venue: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  predBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  predText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
});

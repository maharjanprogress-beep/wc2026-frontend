import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { TEAMS, GROUPS, GROUP_STAGE_MATCHES } from "@/constants/wcData";
import { MatchCard } from "@/components/MatchCard";

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const team = id ? TEAMS[id] : undefined;
  const group = team ? GROUPS.find((g) => g.id === team.group) : undefined;
  const teamMatches = GROUP_STAGE_MATCHES.filter(
    (m) => m.homeTeam === id || m.awayTeam === id
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!team) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>Team not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groupOpponents = group?.teams.filter((t) => t !== id) ?? [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#0D1117", "#1A2A1A"]}
        style={[styles.hero, { paddingTop: topPad }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <Text style={styles.heroFlag}>{team.flag}</Text>
          <Text style={styles.heroName}>{team.name}</Text>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>Group {team.group}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={[styles.badgeText, { color: "#fff" }]}>{team.confederation}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>#{team.ranking}</Text>
            <Text style={styles.statLabel}>FIFA Rank</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{teamMatches.length}</Text>
            <Text style={styles.statLabel}>Group Games</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>2026</Text>
            <Text style={styles.statLabel}>Tournament</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group {team.group} Opponents</Text>
        <View style={styles.opponentsRow}>
          {groupOpponents.map((oppId) => {
            const opp = TEAMS[oppId];
            return (
              <TouchableOpacity
                key={oppId}
                onPress={() => router.push(`/team/${oppId}`)}
                style={[styles.oppCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={styles.oppFlag}>{opp?.flag ?? "🏳️"}</Text>
                <Text style={[styles.oppName, { color: colors.foreground }]} numberOfLines={1}>{opp?.name ?? oppId}</Text>
                <Text style={[styles.oppRank, { color: colors.mutedForeground }]}>#{opp?.ranking}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group Stage Matches</Text>
        {teamMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => router.push(`/match/${match.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    marginBottom: 8,
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  heroFlag: { fontSize: 56 },
  heroName: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  heroBadgeRow: { flexDirection: "row", gap: 8 },
  badge: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: 1, height: 30 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  opponentsRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  oppCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  oppFlag: { fontSize: 28 },
  oppName: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  oppRank: { fontSize: 10, fontFamily: "Inter_400Regular" },
  errorText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  backLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 8 },
});

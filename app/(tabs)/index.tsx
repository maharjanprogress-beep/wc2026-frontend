import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { TOP_CONTENDERS, GROUP_STAGE_MATCHES, GROUPS, TEAMS } from "@/constants/wcData";
import { MatchCard } from "@/components/MatchCard";

const FEATURED_MATCHES = GROUP_STAGE_MATCHES.filter(
  (m) =>
    ["Argentina", "France", "Brazil", "England", "Spain", "Germany"].includes(m.homeTeam) ||
    ["Argentina", "France", "Brazil", "England", "Spain", "Germany"].includes(m.awayTeam)
).slice(0, 6);

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#0D1117", "#1A2A1A", "#0D1117"]}
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroFlag}>🏆</Text>
          <Text style={styles.heroTitle}>FIFA World Cup</Text>
          <Text style={[styles.heroYear, { color: colors.primary }]}>2026</Text>
          <Text style={styles.heroSub}>USA · Canada · Mexico</Text>
          <View style={[styles.heroBadge, { backgroundColor: colors.primary + "20", borderColor: colors.primary }]}>
            <Text style={[styles.heroBadgeText, { color: colors.primary }]}>
              ⚡ AI-Powered Predictions
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>48</Text>
            <Text style={styles.statLabel}>Teams</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>104</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>12</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>16</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Title Favorites</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
          {TOP_CONTENDERS.map((c) => (
            <TouchableOpacity
              key={c.team}
              onPress={() => router.push(`/team/${TEAMS[c.team]?.id ?? c.team}`)}
              style={[styles.favoriteCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.favFlag}>{c.flag}</Text>
              <Text style={[styles.favTeam, { color: colors.foreground }]}>{c.team}</Text>
              <View style={[styles.oddsBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.oddsText, { color: colors.primary }]}>{c.odds}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Matches</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/matches")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {FEATURED_MATCHES.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => router.push(`/match/${match.id}`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Groups</Text>
        <View style={styles.groupsGrid}>
          {GROUPS.slice(0, 6).map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => router.push("/(tabs)/groups")}
              style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.groupId, { color: colors.primary }]}>{group.name}</Text>
              {group.teams.map((teamId) => {
                const t = TEAMS[teamId];
                return (
                  <View key={teamId} style={styles.groupTeamRow}>
                    <Text style={styles.groupFlag}>{t?.flag ?? "🏳️"}</Text>
                    <Text style={[styles.groupTeam, { color: colors.foreground }]} numberOfLines={1}>
                      {t?.name ?? teamId}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginBottom: 4,
  },
  heroContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  heroFlag: { fontSize: 48, marginBottom: 8 },
  heroTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroYear: {
    fontSize: 48,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    lineHeight: 52,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    marginBottom: 14,
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  heroBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: 1, height: 30 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  favoritesList: { paddingBottom: 4, gap: 10 },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    width: 100,
    gap: 6,
  },
  favFlag: { fontSize: 32 },
  favTeam: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  oddsBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  oddsText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  groupsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: "47%",
    gap: 4,
  },
  groupId: { fontSize: 12, fontFamily: "Inter_700Bold", marginBottom: 4 },
  groupTeamRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  groupFlag: { fontSize: 14 },
  groupTeam: { fontSize: 11, fontFamily: "Inter_400Regular", flex: 1 },
});

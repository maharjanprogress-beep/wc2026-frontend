import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { GROUPS, TEAMS } from "@/constants/wcData";
import { GROUP_STAGE_MATCHES } from "@/constants/wcData";

export default function GroupsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState("A");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const group = GROUPS.find((g) => g.id === selectedGroup)!;
  const groupMatches = GROUP_STAGE_MATCHES.filter((m) => m.group === selectedGroup);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Groups</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBar, { borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabBarContent}
      >
        {GROUPS.map((g) => (
          <TouchableOpacity
            key={g.id}
            onPress={() => setSelectedGroup(g.id)}
            style={[
              styles.tab,
              selectedGroup === g.id && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedGroup === g.id ? "#000" : colors.mutedForeground },
                selectedGroup === g.id && { fontFamily: "Inter_700Bold" },
              ]}
            >
              {g.id}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{group.name} Teams</Text>
          <View style={[styles.table, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.thTeam, { color: colors.mutedForeground }]}>Team</Text>
              <Text style={[styles.thStat, { color: colors.mutedForeground }]}>Rank</Text>
              <Text style={[styles.thStat, { color: colors.mutedForeground }]}>Conf.</Text>
            </View>
            {group.teams.map((teamId, idx) => {
              const team = TEAMS[teamId];
              return (
                <TouchableOpacity
                  key={teamId}
                  onPress={() => router.push(`/team/${teamId}`)}
                  style={[
                    styles.tableRow,
                    idx < group.teams.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.teamCell}>
                    <Text style={styles.rowFlag}>{team?.flag ?? "🏳️"}</Text>
                    <Text style={[styles.rowTeam, { color: colors.foreground }]}>{team?.name ?? teamId}</Text>
                  </View>
                  <Text style={[styles.rowStat, { color: colors.mutedForeground }]}>#{team?.ranking ?? "–"}</Text>
                  <Text style={[styles.rowStat, { color: colors.mutedForeground }]}>{team?.confederation ?? "–"}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{group.name} Matches</Text>
          {groupMatches.map((match) => (
            <TouchableOpacity
              key={match.id}
              onPress={() => router.push(`/match/${match.id}`)}
              style={[styles.matchRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.matchTeamSide}>
                <Text style={styles.matchFlag}>{TEAMS[match.homeTeam]?.flag ?? "🏳️"}</Text>
                <Text style={[styles.matchTeam, { color: colors.foreground }]} numberOfLines={1}>
                  {TEAMS[match.homeTeam]?.name ?? match.homeTeam}
                </Text>
              </View>
              <View style={[styles.matchVs, { backgroundColor: colors.muted }]}>
                <Text style={[styles.vsText, { color: colors.mutedForeground }]}>VS</Text>
              </View>
              <View style={[styles.matchTeamSide, styles.matchRight]}>
                <Text style={styles.matchFlag}>{TEAMS[match.awayTeam]?.flag ?? "🏳️"}</Text>
                <Text style={[styles.matchTeam, { color: colors.foreground }]} numberOfLines={1}>
                  {TEAMS[match.awayTeam]?.name ?? match.awayTeam}
                </Text>
              </View>
              <View style={[styles.predictBtn, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
                <Text style={[styles.predictBtnText, { color: colors.primary }]}>Predict</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  tabBar: {
    borderBottomWidth: 1,
    maxHeight: 52,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: "center",
  },
  tab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  content: { flex: 1 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 10 },
  table: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  thTeam: { flex: 1, fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase" },
  thStat: { width: 60, fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", textAlign: "center" },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  teamCell: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  rowFlag: { fontSize: 22 },
  rowTeam: { fontSize: 14, fontFamily: "Inter_500Medium" },
  rowStat: { width: 60, fontSize: 13, textAlign: "center", fontFamily: "Inter_400Regular" },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  matchTeamSide: { flex: 1, alignItems: "flex-start", gap: 2 },
  matchRight: { alignItems: "flex-end" },
  matchFlag: { fontSize: 20 },
  matchTeam: { fontSize: 11, fontFamily: "Inter_500Medium" },
  matchVs: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vsText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  predictBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  predictBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

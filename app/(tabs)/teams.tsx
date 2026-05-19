import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { TEAMS } from "@/constants/wcData";

const CONFEDERATIONS = ["All", "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];

const teamList = Object.values(TEAMS).sort((a, b) => a.ranking - b.ranking);

export default function TeamsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [conf, setConf] = useState("All");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = teamList.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesConf = conf === "All" || t.confederation === conf;
    return matchesSearch && matchesConf;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Teams</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search teams..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.confBar, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CONFEDERATIONS}
          keyExtractor={(c) => c}
          contentContainerStyle={styles.confList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setConf(item)}
              style={[
                styles.confChip,
                { borderColor: colors.border },
                conf === item && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.confText,
                  { color: conf === item ? "#000" : colors.mutedForeground },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/team/${item.id}`)}
            style={[styles.teamCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={styles.teamFlag}>{item.flag}</Text>
            <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
            <View style={styles.teamMeta}>
              <View style={[styles.groupBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.groupBadgeText, { color: colors.primary }]}>Group {item.group}</Text>
              </View>
              <Text style={[styles.rankText, { color: colors.mutedForeground }]}>#{item.ranking}</Text>
            </View>
            <Text style={[styles.confLabel, { color: colors.mutedForeground }]}>{item.confederation}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  confBar: { borderBottomWidth: 1 },
  confList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  confChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  confText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  grid: { padding: 10 },
  columnWrapper: { gap: 10, marginBottom: 10 },
  teamCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    alignItems: "flex-start",
  },
  teamFlag: { fontSize: 36 },
  teamName: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  teamMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  groupBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  groupBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  rankText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  confLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
});

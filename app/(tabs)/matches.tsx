import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { GROUP_STAGE_MATCHES, KNOCKOUT_MATCHES, GROUPS } from "@/constants/wcData";
import { MatchCard } from "@/components/MatchCard";

const FILTERS = ["All", "Group Stage", "Round of 32", "Quarter-finals", "Semi-finals", "Final"];

export default function MatchesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const allMatches = [...GROUP_STAGE_MATCHES, ...KNOCKOUT_MATCHES];

  const filtered = allMatches.filter((m) => {
    if (filter === "All") {
      if (groupFilter) return m.group === groupFilter;
      return true;
    }
    if (filter === "Group Stage") {
      if (groupFilter) return m.group === groupFilter;
      return m.stage.startsWith("Group");
    }
    if (filter === "Round of 32") return m.stage === "Round of 32";
    if (filter === "Quarter-finals") return m.stage === "Quarter-final";
    if (filter === "Semi-finals") return m.stage === "Semi-final";
    if (filter === "Final") return m.stage === "Final" || m.stage === "Third Place";
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Matches</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{filtered.length} matches</Text>
      </View>

      <View style={[styles.filterBar, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(f) => f}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setFilter(item);
                if (item !== "Group Stage" && item !== "All") setGroupFilter(null);
              }}
              style={[
                styles.filterChip,
                { borderColor: colors.border },
                filter === item && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === item ? "#000" : colors.mutedForeground },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {(filter === "All" || filter === "Group Stage") && (
        <View style={[styles.groupBar, { borderBottomColor: colors.border }]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: null, name: "All Groups" }, ...GROUPS.map((g) => ({ id: g.id, name: g.name }))]}
            keyExtractor={(g) => g.name}
            contentContainerStyle={styles.groupList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setGroupFilter(item.id)}
                style={[
                  styles.groupChip,
                  groupFilter === item.id && { backgroundColor: colors.secondary ?? "#1E4D2B" },
                ]}
              >
                <Text
                  style={[
                    styles.groupChipText,
                    { color: groupFilter === item.id ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => {
              if (!item.homeTeam.startsWith("TBD") && !item.homeTeam.includes("/")) {
                router.push(`/match/${item.id}`);
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
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
  },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  filterBar: {
    borderBottomWidth: 1,
  },
  filterList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  groupBar: {
    borderBottomWidth: 1,
  },
  groupList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  groupChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  groupChipText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  list: {
    padding: 12,
  },
});

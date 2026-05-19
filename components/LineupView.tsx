import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Player } from "@/contexts/PredictionsContext";

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeLineup: Player[];
  awayLineup: Player[];
  homeFormation: string;
  awayFormation: string;
}

const POSITION_ORDER = ["GK", "CB", "LB", "RB", "LWB", "RWB", "CDM", "CM", "CAM", "LW", "RW", "ST"];

function groupByPosition(lineup: Player[]): Record<string, Player[]> {
  const grouped: Record<string, Player[]> = {};
  for (const player of lineup) {
    const pos = player.position;
    if (!grouped[pos]) grouped[pos] = [];
    grouped[pos].push(player);
  }
  return grouped;
}

function getRows(lineup: Player[], formation: string): Player[][] {
  const rows: Player[][] = [];
  const parts = formation.split("-").map(Number);

  let idx = 0;
  const sorted = [...lineup].sort((a, b) => {
    const ai = POSITION_ORDER.indexOf(a.position);
    const bi = POSITION_ORDER.indexOf(b.position);
    return ai - bi;
  });

  rows.push([sorted[idx++]]); // GK
  for (const count of parts) {
    rows.push(sorted.slice(idx, idx + count));
    idx += count;
  }
  return rows;
}

interface PlayerDotProps {
  player: Player;
  colors: ReturnType<typeof useColors>;
  isHome: boolean;
}

function PlayerDot({ player, colors, isHome }: PlayerDotProps) {
  return (
    <View style={styles.playerDot}>
      <View style={[styles.dot, { backgroundColor: isHome ? colors.primary : colors.secondary ?? "#1E4D2B" }]}>
        <Text style={styles.dotNumber}>{player.number}</Text>
      </View>
      <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>
        {player.name.split(" ").slice(-1)[0]}
      </Text>
    </View>
  );
}

export function LineupView({ homeTeam, awayTeam, homeFlag, awayFlag, homeLineup, awayLineup, homeFormation, awayFormation }: Props) {
  const colors = useColors();

  const homeRows = getRows(homeLineup, homeFormation);
  const awayRows = getRows(awayLineup, awayFormation).reverse();

  return (
    <View>
      <View style={styles.formationHeader}>
        <View style={styles.formationTeam}>
          <Text style={styles.flag}>{homeFlag}</Text>
          <Text style={[styles.teamLabel, { color: colors.foreground }]}>{homeTeam}</Text>
          <Text style={[styles.formation, { color: colors.primary }]}>{homeFormation}</Text>
        </View>
        <View style={styles.formationTeam}>
          <Text style={styles.flag}>{awayFlag}</Text>
          <Text style={[styles.teamLabel, { color: colors.foreground }]}>{awayTeam}</Text>
          <Text style={[styles.formation, { color: colors.secondary ?? "#1E4D2B" }]}>{awayFormation}</Text>
        </View>
      </View>

      <View style={[styles.pitch, { backgroundColor: "#1A4A2E" }]}>
        <View style={[styles.halfLine, { borderColor: "rgba(255,255,255,0.2)" }]} />
        {awayRows.map((row, i) => (
          <View key={`away-${i}`} style={styles.row}>
            {row.map((player) => (
              <PlayerDot key={player.number} player={player} colors={colors} isHome={false} />
            ))}
          </View>
        ))}
        <View style={styles.midSpacer} />
        {homeRows.map((row, i) => (
          <View key={`home-${i}`} style={styles.row}>
            {row.map((player) => (
              <PlayerDot key={player.number} player={player} colors={colors} isHome={true} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  formationTeam: {
    alignItems: "center",
    gap: 2,
  },
  flag: { fontSize: 24 },
  teamLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  formation: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  pitch: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 380,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  halfLine: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "50%",
    height: 1,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 2,
  },
  midSpacer: {
    height: 4,
  },
  playerDot: {
    alignItems: "center",
    width: 48,
    gap: 2,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dotNumber: {
    color: "#000",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  playerName: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});

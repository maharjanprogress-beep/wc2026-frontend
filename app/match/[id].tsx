import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { ALL_MATCHES, TEAMS } from "@/constants/wcData";
import { usePredictions } from "@/contexts/PredictionsContext";
import { PredictionLoading } from "@/components/PredictionLoading";
import { LineupView } from "@/components/LineupView";

const IMPACT_COLORS: Record<string, string> = {
  high: "#F85149",
  medium: "#D4A843",
  low: "#3FB950",
};

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { predictions, loading, errors, fetchPrediction, refreshPrediction } = usePredictions();
  const [activeTab, setActiveTab] = useState<"overview" | "lineup" | "scorers" | "factors">("overview");

  const match = ALL_MATCHES.find((m) => m.id === id);
  const prediction = id ? predictions[id] : undefined;
  const isLoading = id ? (loading[id] ?? false) : false;
  const error = id ? (errors[id] ?? "") : "";

  const homeTeam = match ? TEAMS[match.homeTeam] : undefined;
  const awayTeam = match ? TEAMS[match.awayTeam] : undefined;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    if (match && !prediction && !isLoading) {
      void fetchPrediction(match.id, match.homeTeam, match.awayTeam, match.stage);
    }
  }, [match?.id]);

  if (!match) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>Match not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRefresh = () => {
    if (isLoading) return;
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS === "web") {
      void refreshPrediction(match.id, match.homeTeam, match.awayTeam, match.stage);
    } else {
      Alert.alert(
        "Refresh Prediction",
        "This will fetch a fresh AI prediction with the latest available squad data. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Refresh",
            onPress: () => {
              void refreshPrediction(match.id, match.homeTeam, match.awayTeam, match.stage);
            },
          },
        ]
      );
    }
  };

  const getPredictionColor = () => {
    if (!prediction) return colors.primary;
    if (prediction.prediction === "home_win") return "#3FB950";
    if (prediction.prediction === "away_win") return "#F85149";
    return "#D4A843";
  };

  const getPredictionLabel = () => {
    if (!prediction) return "–";
    if (prediction.prediction === "home_win") return `${match.homeTeam} Win`;
    if (prediction.prediction === "away_win") return `${match.awayTeam} Win`;
    return "Draw";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0D1117", "#1A2A1A"]}
        style={[styles.hero, { paddingTop: topPad }]}
      >
        <View style={styles.heroTopRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRefresh}
            style={[
              styles.refreshBtn,
              isLoading && { opacity: 0.4 },
            ]}
            disabled={isLoading}
          >
            <Feather name="refresh-cw" size={16} color="#D4A843" />
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.stageBadge, { color: "rgba(255,255,255,0.6)" }]}>{match.stage}</Text>
        <Text style={[styles.dateLine, { color: "rgba(255,255,255,0.4)" }]}>
          {match.date} · {match.city}
        </Text>

        <View style={styles.teamsHero}>
          <View style={styles.heroTeam}>
            <Text style={styles.heroFlag}>{homeTeam?.flag ?? "🏳️"}</Text>
            <Text style={styles.heroTeamName}>{homeTeam?.name ?? match.homeTeam}</Text>
            {prediction && (
              <Text style={[styles.heroScore, { color: prediction.prediction === "home_win" ? "#3FB950" : "#fff" }]}>
                {prediction.predictedHomeScore}
              </Text>
            )}
          </View>

          <View style={styles.heroVs}>
            {prediction ? (
              <View style={[styles.predBall, { backgroundColor: getPredictionColor() + "20", borderColor: getPredictionColor() }]}>
                <Text style={[styles.predPercent, { color: getPredictionColor() }]}>{prediction.confidence}%</Text>
                <Text style={styles.confLabel}>CONF.</Text>
              </View>
            ) : (
              <View style={[styles.predBall, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.vsHero}>VS</Text>
              </View>
            )}
          </View>

          <View style={[styles.heroTeam, styles.heroTeamRight]}>
            <Text style={styles.heroFlag}>{awayTeam?.flag ?? "🏳️"}</Text>
            <Text style={styles.heroTeamName}>{awayTeam?.name ?? match.awayTeam}</Text>
            {prediction && (
              <Text style={[styles.heroScore, { color: prediction.prediction === "away_win" ? "#3FB950" : "#fff" }]}>
                {prediction.predictedAwayScore}
              </Text>
            )}
          </View>
        </View>

        {prediction && (
          <View style={styles.predictionFooter}>
            <View style={[styles.outcomeBar, { backgroundColor: getPredictionColor() + "20", borderColor: getPredictionColor() + "40" }]}>
              <Text style={[styles.outcomeText, { color: getPredictionColor() }]}>
                Predicted: {getPredictionLabel()}
              </Text>
            </View>

            {prediction.usedLiveData && (
              <View style={styles.liveDataBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveDataText}>Live Squad Data</Text>
              </View>
            )}
          </View>
        )}
      </LinearGradient>

      {isLoading && <PredictionLoading />}

      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>Failed to load prediction</Text>
          <Text style={[styles.errorSub, { color: colors.mutedForeground }]}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchPrediction(match.id, match.homeTeam, match.awayTeam, match.stage)}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {prediction && !isLoading && (
        <>
          <View style={[styles.tabRow, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
            {(["overview", "lineup", "scorers", "factors"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  setActiveTab(tab);
                  if (Platform.OS !== "web") void Haptics.selectionAsync();
                }}
                style={[
                  styles.tab,
                  activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab ? colors.primary : colors.mutedForeground },
                    activeTab === tab && { fontFamily: "Inter_700Bold" },
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "overview" && (
              <View style={styles.overviewSection}>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>Match Analysis</Text>
                  <Text style={[styles.analysisText, { color: colors.foreground }]}>{prediction.analysis}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>Score Prediction</Text>
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreTeam}>
                      <Text style={styles.scoreFlag}>{homeTeam?.flag}</Text>
                      <Text style={[styles.scoreTeamName, { color: colors.foreground }]}>{homeTeam?.name}</Text>
                    </View>
                    <View style={[styles.scoreBig, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.scoreNum, { color: colors.foreground }]}>
                        {prediction.predictedHomeScore} – {prediction.predictedAwayScore}
                      </Text>
                    </View>
                    <View style={[styles.scoreTeam, styles.scoreTeamRight]}>
                      <Text style={styles.scoreFlag}>{awayTeam?.flag}</Text>
                      <Text style={[styles.scoreTeamName, { color: colors.foreground }]}>{awayTeam?.name}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>Formations</Text>
                  <View style={styles.formationsRow}>
                    <View style={styles.formationItem}>
                      <Text style={styles.formFlag}>{homeTeam?.flag}</Text>
                      <Text style={[styles.formName, { color: colors.foreground }]}>{homeTeam?.name}</Text>
                      <View style={[styles.formBadge, { backgroundColor: colors.primary + "20" }]}>
                        <Text style={[styles.formNum, { color: colors.primary }]}>{prediction.homeFormation}</Text>
                      </View>
                    </View>
                    <View style={styles.formationItem}>
                      <Text style={styles.formFlag}>{awayTeam?.flag}</Text>
                      <Text style={[styles.formName, { color: colors.foreground }]}>{awayTeam?.name}</Text>
                      <View style={[styles.formBadge, { backgroundColor: "#1E4D2B" }]}>
                        <Text style={[styles.formNum, { color: "#fff" }]}>{prediction.awayFormation}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "lineup" && match && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>Predicted Starting XIs</Text>
                <LineupView
                  homeTeam={homeTeam?.name ?? match.homeTeam}
                  awayTeam={awayTeam?.name ?? match.awayTeam}
                  homeFlag={homeTeam?.flag ?? "🏳️"}
                  awayFlag={awayTeam?.flag ?? "🏳️"}
                  homeLineup={prediction.homeLineup}
                  awayLineup={prediction.awayLineup}
                  homeFormation={prediction.homeFormation}
                  awayFormation={prediction.awayFormation}
                />
                <View style={[styles.lineupLegend, { borderTopColor: colors.border }]}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{homeTeam?.name}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#1E4D2B" }]} />
                    <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{awayTeam?.name}</Text>
                  </View>
                </View>
                <Text style={[styles.lineupNote, { color: colors.mutedForeground }]}>
                  Scroll lineup to see all positions. Attack at bottom, defense at top for home team.
                </Text>
              </View>
            )}

            {activeTab === "scorers" && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Likely Goal Scorers</Text>
                {prediction.keyScorers.map((scorer, i) => (
                  <View key={i} style={[styles.scorerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.scorerHeader}>
                      <View style={styles.scorerInfo}>
                        <Text style={styles.scorerTeamFlag}>
                          {scorer.team === match.homeTeam ? homeTeam?.flag : awayTeam?.flag}
                        </Text>
                        <View>
                          <Text style={[styles.scorerName, { color: colors.foreground }]}>{scorer.name}</Text>
                          <Text style={[styles.scorerTeam, { color: colors.mutedForeground }]}>{scorer.team}</Text>
                        </View>
                      </View>
                      <View style={styles.scorerStats}>
                        <View style={[styles.probBadge, { backgroundColor: colors.primary + "20" }]}>
                          <Text style={[styles.probText, { color: colors.primary }]}>{scorer.probability}%</Text>
                        </View>
                        <Text style={[styles.goalsText, { color: colors.foreground }]}>
                          {scorer.predictedGoals} {scorer.predictedGoals === 1 ? "goal" : "goals"}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.probBar, { backgroundColor: colors.muted }]}>
                      <View style={[styles.probFill, { backgroundColor: colors.primary, width: `${scorer.probability}%` as any }]} />
                    </View>
                    <Text style={[styles.scorerReason, { color: colors.mutedForeground }]}>{scorer.reason}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === "factors" && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Key Match Factors</Text>
                {prediction.keyFactors.map((factor, i) => (
                  <View key={i} style={[styles.factorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.factorHeader}>
                      <View style={styles.factorTitleRow}>
                        <View style={[styles.impactDot, { backgroundColor: IMPACT_COLORS[factor.impact] ?? colors.primary }]} />
                        <Text style={[styles.factorTitle, { color: colors.foreground }]}>{factor.title}</Text>
                      </View>
                      <View style={styles.factorBadges}>
                        <View style={[styles.impactBadge, { backgroundColor: (IMPACT_COLORS[factor.impact] ?? colors.primary) + "20" }]}>
                          <Text style={[styles.impactText, { color: IMPACT_COLORS[factor.impact] ?? colors.primary }]}>
                            {factor.impact.toUpperCase()}
                          </Text>
                        </View>
                        {factor.favoredTeam !== "neutral" && (
                          <Text style={styles.favoredFlag}>
                            {factor.favoredTeam === "home" ? homeTeam?.flag : awayTeam?.flag}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.factorDesc, { color: colors.mutedForeground }]}>{factor.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(212,168,67,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.35)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  refreshBtnText: {
    color: "#D4A843",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  stageBadge: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  dateLine: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  teamsHero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroTeam: { flex: 1, alignItems: "flex-start", gap: 4 },
  heroTeamRight: { alignItems: "flex-end" },
  heroFlag: { fontSize: 36 },
  heroTeamName: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  heroScore: { fontSize: 32, fontFamily: "Inter_700Bold" },
  heroVs: { alignItems: "center" },
  predBall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  predPercent: { fontSize: 18, fontFamily: "Inter_700Bold" },
  confLabel: { fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  vsHero: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "Inter_700Bold" },
  predictionFooter: {
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  outcomeBar: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  outcomeText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  liveDataBadge: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    backgroundColor: "rgba(63,185,80,0.12)",
    borderWidth: 1,
    borderColor: "rgba(63,185,80,0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3FB950",
  },
  liveDataText: {
    color: "#3FB950",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  content: { flex: 1 },
  overviewSection: { gap: 12 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  analysisText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scoreTeam: { flex: 1, alignItems: "flex-start", gap: 4 },
  scoreTeamRight: { alignItems: "flex-end" },
  scoreFlag: { fontSize: 28 },
  scoreTeamName: { fontSize: 12, fontFamily: "Inter_500Medium" },
  scoreBig: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  scoreNum: { fontSize: 24, fontFamily: "Inter_700Bold" },
  formationsRow: { flexDirection: "row", justifyContent: "space-around" },
  formationItem: { alignItems: "center", gap: 6 },
  formFlag: { fontSize: 28 },
  formName: { fontSize: 12, fontFamily: "Inter_500Medium" },
  formBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  formNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  lineupLegend: { flexDirection: "row", gap: 16, paddingTop: 12, borderTopWidth: 1, marginTop: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  lineupNote: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  sectionLabel: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  scorerCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  scorerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  scorerInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  scorerTeamFlag: { fontSize: 24 },
  scorerName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  scorerTeam: { fontSize: 11, fontFamily: "Inter_400Regular" },
  scorerStats: { alignItems: "flex-end", gap: 4 },
  probBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  probText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  goalsText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  probBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  probFill: { height: 4, borderRadius: 2 },
  scorerReason: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  factorCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  factorHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  factorTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  impactDot: { width: 8, height: 8, borderRadius: 4 },
  factorTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  factorBadges: { flexDirection: "row", alignItems: "center", gap: 6 },
  impactBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  impactText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  favoredFlag: { fontSize: 16 },
  factorDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  errorText: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  errorSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  retryBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  retryText: { color: "#000", fontFamily: "Inter_700Bold", fontSize: 14 },
  backLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 8 },
});

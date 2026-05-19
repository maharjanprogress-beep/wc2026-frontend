import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Player {
  name: string;
  position: string;
  number: number;
}

export interface ScorerPrediction {
  name: string;
  team: string;
  probability: number;
  predictedGoals: number;
  reason: string;
}

export interface KeyFactor {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  favoredTeam: "home" | "away" | "neutral";
}

export interface MatchPrediction {
  predictedHomeScore: number;
  predictedAwayScore: number;
  homeLineup: Player[];
  awayLineup: Player[];
  homeFormation: string;
  awayFormation: string;
  keyScorers: ScorerPrediction[];
  keyFactors: KeyFactor[];
  analysis: string;
  confidence: number;
  prediction: "home_win" | "draw" | "away_win";
  usedLiveData?: boolean;
}

interface PredictionsContextType {
  predictions: Record<string, MatchPrediction>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  fetchPrediction: (matchId: string, homeTeam: string, awayTeam: string, stage: string) => Promise<void>;
  refreshPrediction: (matchId: string, homeTeam: string, awayTeam: string, stage: string) => Promise<void>;
}

const PredictionsContext = createContext<PredictionsContextType | null>(null);

const CACHE_PREFIX = "wc2026_prediction_";

async function doFetch(homeTeam: string, awayTeam: string, stage: string): Promise<MatchPrediction> {
  const apiUrl = process.env["EXPO_PUBLIC_API_URL"];
  const domain = process.env["EXPO_PUBLIC_DOMAIN"];
  const baseUrl = apiUrl ?? (domain ? `https://${domain}` : "");
  const response = await fetch(`${baseUrl}/api/predictions/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ homeTeam, awayTeam, stage }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return (await response.json()) as MatchPrediction;
}

export function PredictionsProvider({ children }: { children: React.ReactNode }) {
  const [predictions, setPredictions] = useState<Record<string, MatchPrediction>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchPrediction = useCallback(async (
    matchId: string,
    homeTeam: string,
    awayTeam: string,
    stage: string
  ) => {
    if (predictions[matchId] || loading[matchId]) return;

    try {
      const cached = await AsyncStorage.getItem(CACHE_PREFIX + matchId);
      if (cached) {
        const parsed = JSON.parse(cached) as MatchPrediction;
        setPredictions((prev) => ({ ...prev, [matchId]: parsed }));
        return;
      }
    } catch {}

    setLoading((prev) => ({ ...prev, [matchId]: true }));
    setErrors((prev) => ({ ...prev, [matchId]: "" }));

    try {
      const data = await doFetch(homeTeam, awayTeam, stage);
      setPredictions((prev) => ({ ...prev, [matchId]: data }));
      try {
        await AsyncStorage.setItem(CACHE_PREFIX + matchId, JSON.stringify(data));
      } catch {}
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate prediction";
      setErrors((prev) => ({ ...prev, [matchId]: message }));
    } finally {
      setLoading((prev) => ({ ...prev, [matchId]: false }));
    }
  }, [predictions, loading]);

  const refreshPrediction = useCallback(async (
    matchId: string,
    homeTeam: string,
    awayTeam: string,
    stage: string
  ) => {
    if (loading[matchId]) return;

    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + matchId);
    } catch {}

    setPredictions((prev) => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });

    setLoading((prev) => ({ ...prev, [matchId]: true }));
    setErrors((prev) => ({ ...prev, [matchId]: "" }));

    try {
      const data = await doFetch(homeTeam, awayTeam, stage);
      setPredictions((prev) => ({ ...prev, [matchId]: data }));
      try {
        await AsyncStorage.setItem(CACHE_PREFIX + matchId, JSON.stringify(data));
      } catch {}
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate prediction";
      setErrors((prev) => ({ ...prev, [matchId]: message }));
    } finally {
      setLoading((prev) => ({ ...prev, [matchId]: false }));
    }
  }, [loading]);

  return (
    <PredictionsContext.Provider value={{ predictions, loading, errors, fetchPrediction, refreshPrediction }}>
      {children}
    </PredictionsContext.Provider>
  );
}

export function usePredictions() {
  const ctx = useContext(PredictionsContext);
  if (!ctx) throw new Error("usePredictions must be used within PredictionsProvider");
  return ctx;
}

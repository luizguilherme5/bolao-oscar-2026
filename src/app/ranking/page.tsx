"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import { categories, nominees } from "@/lib/data";
import type { RankingEntry } from "@/app/api/ranking/route";

type TabType = "willWin" | "wantToWin";

export default function RankingPage() {
  const [tab, setTab] = useState<TabType>("willWin");
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [winnersCount, setWinnersCount] = useState(0);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ranking")
      .then((r) => r.json())
      .then((data) => {
        setRankings(data.rankings || []);
        setWinners(data.winners || {});
        setWinnersCount(data.winnersCount || 0);
        setLoading(false);
      });
  }, []);

  const sortedRankings = [...rankings].sort((a, b) => {
    const scoreA = tab === "willWin" ? a.willWinScore : a.wantToWinScore;
    const scoreB = tab === "willWin" ? b.willWinScore : b.wantToWinScore;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
  });

  const medals = ["🥇", "🥈", "🥉"];
  const hasWinners = winnersCount > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="text-5xl"
        >
          📊
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {hasWinners && sortedRankings.length > 0 && <Confetti count={15} />}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-carnival-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/" className="text-2xl">🏆</Link>
          <div className="flex-1">
            <p className="font-display text-sm text-golden">Ranking do Bolão</p>
            <p className="text-white/40 text-xs font-body">
              {winnersCount} de 24 categorias apuradas
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex gap-1 glass-card rounded-xl p-1">
          <button
            onClick={() => setTab("willWin")}
            className={`flex-1 py-2.5 rounded-lg font-body font-bold text-sm transition-all ${
              tab === "willWin"
                ? "bg-gradient-to-r from-carnival-yellow/30 to-carnival-orange/30 text-carnival-yellow"
                : "text-white/50"
            }`}
          >
            🏆 Vai Ganhar
          </button>
          <button
            onClick={() => setTab("wantToWin")}
            className={`flex-1 py-2.5 rounded-lg font-body font-bold text-sm transition-all ${
              tab === "wantToWin"
                ? "bg-gradient-to-r from-carnival-pink/30 to-carnival-purple/30 text-carnival-pink"
                : "text-white/50"
            }`}
          >
            ❤️ Quero que Ganhe
          </button>
        </div>
      </div>

      {/* Rankings list */}
      <div className="px-4 max-w-lg mx-auto space-y-2">
        {sortedRankings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🍿</p>
            <p className="text-white/50 font-body">Nenhum participante ainda!</p>
            <p className="text-white/30 font-body text-sm mt-1">Seja o primeiro a dar seus palpites</p>
          </div>
        ) : (
          sortedRankings.map((entry, index) => {
            const score = tab === "willWin" ? entry.willWinScore : entry.wantToWinScore;
            const details = tab === "willWin" ? entry.willWinDetails : entry.wantToWinDetails;
            const isExpanded = expandedUser === entry.userId;
            const position = index + 1;

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : entry.userId)}
                  className={`w-full glass-card rounded-2xl overflow-hidden text-left active:bg-white/5 transition-all ${
                    position <= 3 && hasWinners ? "border-carnival-yellow/20" : ""
                  }`}
                >
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 text-center shrink-0">
                      {position <= 3 && hasWinners ? (
                        <span className="text-xl">{medals[index]}</span>
                      ) : (
                        <span className="text-white/40 font-display text-lg">{position}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-bold text-white truncate">{entry.name}</p>
                      <p className="text-white/40 text-xs font-body">
                        {entry.totalCategories} categorias preenchidas
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-display text-lg ${
                        hasWinners
                          ? position <= 3
                            ? "text-carnival-yellow"
                            : "text-white"
                          : "text-white/40"
                      }`}>
                        {hasWinners ? score : "-"}
                      </p>
                      {hasWinners && (
                        <p className="text-white/30 text-xs font-body">
                          {score}/{winnersCount}
                        </p>
                      )}
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-white/30 text-xs shrink-0"
                    >
                      ▼
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-card rounded-b-2xl -mt-2 pt-4 px-4 pb-3 space-y-1.5 border-t border-white/5">
                        {categories.map((cat) => {
                          const detail = details[cat.id];
                          const winner = winners[cat.id];
                          const nomineeList = nominees[cat.id] || [];

                          if (!detail) {
                            return (
                              <div key={cat.id} className="flex items-center gap-2 py-1 opacity-30">
                                <span className="text-sm">{cat.emoji}</span>
                                <span className="text-xs font-body text-white/50 flex-1 truncate">{cat.name}</span>
                                <span className="text-xs text-white/30">—</span>
                              </div>
                            );
                          }

                          const pickedNominee = nomineeList.find((n) => n.id === detail.picked);

                          return (
                            <div key={cat.id} className="flex items-center gap-2 py-1">
                              <span className="text-sm">{cat.emoji}</span>
                              <span className="text-xs font-body text-white/50 flex-1 truncate">{cat.name}</span>
                              <span className="text-xs font-body text-white truncate max-w-[120px]">
                                {pickedNominee?.name || "—"}
                              </span>
                              {detail.correct === true && <span className="text-sm">✅</span>}
                              {detail.correct === false && <span className="text-sm">❌</span>}
                              {detail.correct === null && winner === undefined && (
                                <span className="text-sm">⏳</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Apurated categories */}
      {hasWinners && (
        <div className="px-4 py-8 max-w-lg mx-auto">
          <h3 className="font-display text-lg text-carnival-yellow mb-4">
            Vencedores Apurados ({winnersCount}/24)
          </h3>
          <div className="space-y-2">
            {categories
              .filter((cat) => winners[cat.id])
              .map((cat) => {
                const winnerNominee = (nominees[cat.id] || []).find(
                  (n) => n.id === winners[cat.id]
                );
                return (
                  <div key={cat.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 font-body">{cat.name}</p>
                      <p className="font-body font-bold text-carnival-yellow text-sm truncate">
                        {winnerNominee?.name || "—"}
                      </p>
                    </div>
                    <span className="text-lg">🏆</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-carnival-dark/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-body">Início</span>
          </Link>
          <Link href="/votar" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-xl">🎬</span>
            <span className="text-[10px] font-body">Votar</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-carnival-pink">
            <span className="text-xl">📊</span>
            <span className="text-[10px] font-body font-bold">Ranking</span>
          </div>
        </div>
      </div>
    </main>
  );
}

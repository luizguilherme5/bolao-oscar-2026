"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Toast from "@/components/Toast";
import { categories, nominees, categoryGroups } from "@/lib/data";
import type { RankingEntry } from "@/app/api/ranking/route";

export default function ApuracaoPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [winnersRes, rankingRes] = await Promise.all([
      fetch("/api/winners").then((r) => r.json()),
      fetch("/api/ranking").then((r) => r.json()),
    ]);
    setWinners(winnersRes.winners || {});
    setRankings(rankingRes.rankings || []);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "WagnerMoura123") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta! Só o admin pode entrar aqui 🔐");
    }
  };

  const handleSetWinner = async (categoryId: string, nomineeId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, categoryId, nomineeId }),
      });
      const data = await res.json();
      if (data.error) {
        setToast(data.error);
      } else {
        setWinners(data.winners);
        setToast("Vencedor definido!");
        // Reload rankings
        const rankingRes = await fetch("/api/ranking").then((r) => r.json());
        setRankings(rankingRes.rankings || []);
      }
    } catch {
      setToast("Erro ao salvar!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWinner = async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/winners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, categoryId }),
      });
      const data = await res.json();
      if (data.error) {
        setToast(data.error);
      } else {
        setWinners(data.winners);
        setToast("Vencedor removido!");
        const rankingRes = await fetch("/api/ranking").then((r) => r.json());
        setRankings(rankingRes.rankings || []);
      }
    } catch {
      setToast("Erro ao remover!");
    } finally {
      setLoading(false);
    }
  };

  const winnersCount = Object.keys(winners).length;

  if (!authenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="text-6xl mb-6"
        >
          🔐
        </motion.div>

        <h1 className="font-display text-3xl text-golden text-center mb-2">
          Modo Apuração
        </h1>
        <p className="text-white/50 font-body text-sm text-center mb-8">
          Área restrita para o administrador do bolão
        </p>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha do admin"
            className="w-full glass-card rounded-xl px-4 py-3 font-body text-white placeholder:text-white/30 bg-transparent text-center"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-carnival-pink text-sm font-body text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-carnival-orange to-carnival-yellow text-carnival-dark font-display text-lg py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            Entrar como Admin 🎬
          </button>
        </form>

        <Link href="/" className="mt-8 text-white/30 font-body text-sm hover:text-white/50">
          ← Voltar pro início
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-carnival-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/" className="text-2xl">🔐</Link>
          <div className="flex-1">
            <p className="font-display text-sm text-carnival-orange">Modo Apuração</p>
            <p className="text-white/40 text-xs font-body">
              {winnersCount} de 24 categorias apuradas
            </p>
          </div>
          <Link href="/ranking" className="text-xs font-body text-carnival-yellow hover:text-carnival-yellow/80">
            Ver Ranking →
          </Link>
        </div>
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-carnival-orange to-carnival-yellow"
            animate={{ width: `${(winnersCount / 24) * 100}%` }}
          />
        </div>
      </div>

      {/* Live ranking preview */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-display text-sm text-carnival-yellow mb-3">
            Ranking ao Vivo ({rankings.length} participantes)
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {rankings.slice(0, 10).map((entry, i) => (
              <div key={entry.userId} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-center font-display text-white/40">{i + 1}</span>
                <span className="font-body text-white flex-1 truncate">{entry.name}</span>
                <span className="font-display text-carnival-yellow">{entry.willWinScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 max-w-lg mx-auto space-y-6">
        {categoryGroups.map((group) => {
          const groupCategories = categories.filter((c) => c.group === group.id);

          return (
            <div key={group.id}>
              <h2 className="font-display text-lg text-white mb-3 flex items-center gap-2">
                <span>{group.emoji}</span> {group.name}
              </h2>

              <div className="space-y-2">
                {groupCategories.map((category) => {
                  const isExpanded = expandedCategory === category.id;
                  const currentWinner = winners[category.id];
                  const categoryNominees = nominees[category.id] || [];
                  const winnerNominee = categoryNominees.find((n) => n.id === currentWinner);

                  // Count how many people voted for each nominee
                  const voteCounts: Record<string, number> = {};
                  rankings.forEach((r) => {
                    const detail = r.willWinDetails[category.id];
                    if (detail) {
                      voteCounts[detail.picked] = (voteCounts[detail.picked] || 0) + 1;
                    }
                  });

                  return (
                    <div key={category.id} className="glass-card rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5"
                      >
                        <span className="text-xl">{category.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-white text-sm">{category.name}</p>
                          {currentWinner ? (
                            <p className="text-carnival-yellow text-xs font-body truncate">
                              🏆 {winnerNominee?.name}
                            </p>
                          ) : (
                            <p className="text-white/30 text-xs font-body">Pendente</p>
                          )}
                        </div>
                        {currentWinner && <span className="text-carnival-green text-sm">✓</span>}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="text-white/40 text-sm"
                        >
                          ▼
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="px-4 pb-4 space-y-2">
                              {currentWinner && (
                                <button
                                  onClick={() => handleRemoveWinner(category.id)}
                                  disabled={loading}
                                  className="w-full text-xs text-carnival-pink/60 font-body hover:text-carnival-pink py-1"
                                >
                                  Remover vencedor
                                </button>
                              )}
                              {categoryNominees.map((nominee) => {
                                const isWinner = currentWinner === nominee.id;
                                const count = voteCounts[nominee.id] || 0;
                                const percentage = rankings.length > 0
                                  ? Math.round((count / rankings.length) * 100)
                                  : 0;

                                return (
                                  <button
                                    key={nominee.id}
                                    onClick={() => handleSetWinner(category.id, nominee.id)}
                                    disabled={loading}
                                    className={`w-full rounded-xl p-3 text-left transition-all active:scale-98 ${
                                      isWinner
                                        ? "bg-carnival-yellow/20 border-2 border-carnival-yellow"
                                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className={`font-body font-bold text-sm ${isWinner ? "text-carnival-yellow" : "text-white"}`}>
                                          {nominee.name}
                                          {isWinner && " 🏆"}
                                        </p>
                                        <p className="text-white/40 text-xs font-body truncate">{nominee.details}</p>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-white/50 text-xs font-body">{count} votos</p>
                                        <p className="text-white/30 text-[10px] font-body">{percentage}%</p>
                                      </div>
                                    </div>
                                    {/* Vote bar */}
                                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                      <motion.div
                                        className={`h-full rounded-full ${isWinner ? "bg-carnival-yellow" : "bg-carnival-purple/50"}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Toast message={toast} show={!!toast} onHide={() => setToast("")} />
    </main>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { Shield, Trophy, Check, ChevronDown, Home, Film, BarChart3, Crown, Minus, Users, Trash2 } from "lucide-react";
import { categories, nominees, categoryGroups } from "@/lib/data";
import type { RankingEntry } from "@/app/api/ranking/route";

export default function ApuracaoPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; email: string; isAdmin: boolean; createdAt: string }[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Check admin session
  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || !data.user.isAdmin) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      })
      .catch(() => setIsAdmin(false));
  }, []);

  const loadData = useCallback(async () => {
    const [winnersRes, rankingRes, usersRes] = await Promise.all([
      fetch("/api/winners").then((r) => r.json()),
      fetch("/api/ranking").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ]);
    setWinners(winnersRes.winners || {});
    setRankings(rankingRes.rankings || []);
    setUsers(usersRes.users || []);
  }, []);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  const handleSetWinner = async (categoryId: string, nomineeId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, nomineeId }),
      });
      const data = await res.json();
      if (data.error) {
        setToast(data.error);
      } else {
        setWinners(data.winners);
        setToast("Vencedor definido!");
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
        body: JSON.stringify({ categoryId }),
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

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.error) {
        setToast(data.error);
      } else {
        setUsers(data.users);
        setToast("Usuário removido!");
        setConfirmDelete(null);
        const rankingRes = await fetch("/api/ranking").then((r) => r.json());
        setRankings(rankingRes.rankings || []);
      }
    } catch {
      setToast("Erro ao remover usuário!");
    } finally {
      setLoading(false);
    }
  };

  const winnersCount = Object.keys(winners).length;

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Shield className="w-10 h-10 text-amber-400" />
        </motion.div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-950">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <Shield className="w-16 h-16 text-red-400 mb-6" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Acesso Restrito
        </h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Apenas administradores podem acessar a apuração.
        </p>

        <button
          onClick={() => router.push("/votar")}
          className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-medium text-sm hover:bg-zinc-700 transition-colors"
        >
          Voltar para Palpites
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="px-4 py-4 flex items-center gap-3 max-w-lg mx-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-base text-white">Apuração</h1>
            <p className="text-zinc-500 text-xs">
              {winnersCount} de 24 categorias apuradas
            </p>
          </div>
          <div className="badge badge-gold">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{winnersCount}/24</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-zinc-800/60">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
            animate={{ width: `${(winnersCount / 24) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Live mini ranking preview */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-white">
                Ranking ao Vivo
              </h3>
            </div>
            <span className="text-zinc-500 text-xs">
              {rankings.length} participantes
            </span>
          </div>
          <div className="space-y-1.5">
            {rankings.slice(0, 5).map((entry, i) => {
              const medals = ["text-amber-400", "text-zinc-400", "text-amber-600"];
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-zinc-800/40 transition-colors"
                >
                  <span
                    className={`w-6 text-center font-bold text-sm ${
                      i < 3 ? medals[i] : "text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-white flex-1 truncate">
                    {entry.name}
                  </span>
                  <span className="text-sm font-bold text-amber-400 tabular-nums">
                    {entry.totalScore}
                  </span>
                  <span className="text-[10px] text-zinc-600">pts</span>
                </div>
              );
            })}
            {rankings.length === 0 && (
              <p className="text-zinc-600 text-xs text-center py-3">
                Nenhum participante ainda.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* User management */}
      <div className="px-4 pb-4 max-w-lg mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-sm text-white">
                Participantes
              </h3>
            </div>
            <span className="text-zinc-500 text-xs">
              {users.length} cadastrados
            </span>
          </div>
          <div className="space-y-1">
            {users
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-zinc-800/40 transition-colors group"
              >
                <span className="text-sm text-white flex-1 truncate">
                  {user.name}
                  {user.isAdmin && (
                    <span className="ml-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      admin
                    </span>
                  )}
                </span>
                <span className="text-zinc-600 text-xs truncate max-w-[140px]">
                  {user.email}
                </span>
                {!user.isAdmin && (
                  confirmDelete === user.id ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading}
                        className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] font-medium text-zinc-500 px-2 py-1 rounded-lg hover:text-zinc-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all shrink-0 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-zinc-600 text-xs text-center py-3">
                Nenhum usuário cadastrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Categories grouped */}
      <div className="px-4 max-w-lg mx-auto space-y-6">
        {categoryGroups.map((group) => {
          const groupCategories = categories.filter((c) => c.group === group.id);
          const groupWinnersCount = groupCategories.filter(
            (c) => winners[c.id]
          ).length;

          return (
            <div key={group.id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-sm text-white flex items-center gap-2">
                  {group.name}
                </h2>
                <span className="text-zinc-500 text-xs">
                  {groupWinnersCount}/{groupCategories.length} &middot;{" "}
                  {group.description}
                </span>
              </div>

              <div className="space-y-2">
                {groupCategories.map((category) => {
                  const isExpanded = expandedCategory === category.id;
                  const currentWinner = winners[category.id];
                  const categoryNominees = nominees[category.id] || [];
                  const winnerNominee = categoryNominees.find(
                    (n) => n.id === currentWinner
                  );

                  // Count votes per nominee
                  const voteCounts: Record<string, number> = {};
                  rankings.forEach((r) => {
                    const detail = r.willWinDetails[category.id];
                    if (detail) {
                      voteCounts[detail.picked] =
                        (voteCounts[detail.picked] || 0) + 1;
                    }
                  });
                  const totalVotes = Object.values(voteCounts).reduce(
                    (a, b) => a + b,
                    0
                  );

                  return (
                    <div key={category.id} className="card overflow-hidden">
                      <button
                        onClick={() =>
                          setExpandedCategory(isExpanded ? null : category.id)
                        }
                        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">
                            {category.name}
                          </p>
                          {currentWinner ? (
                            <p className="text-amber-400 text-xs truncate flex items-center gap-1 mt-0.5">
                              <Trophy className="w-3 h-3 shrink-0" />
                              {winnerNominee?.namePtBr || winnerNominee?.name}
                            </p>
                          ) : (
                            <p className="text-zinc-600 text-xs mt-0.5">
                              Pendente
                            </p>
                          )}
                        </div>
                        {currentWinner && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-zinc-600" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <div className="px-4 pb-4 space-y-2 border-t border-zinc-800/60 pt-3">
                              {currentWinner && (
                                <button
                                  onClick={() =>
                                    handleRemoveWinner(category.id)
                                  }
                                  disabled={loading}
                                  className="w-full flex items-center justify-center gap-1.5 text-xs text-red-400/60 font-medium hover:text-red-400 py-1.5 rounded-lg hover:bg-red-400/5 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                  Remover vencedor
                                </button>
                              )}

                              {categoryNominees.map((nominee) => {
                                const isWinner = currentWinner === nominee.id;
                                const count = voteCounts[nominee.id] || 0;
                                const percentage =
                                  totalVotes > 0
                                    ? Math.round((count / totalVotes) * 100)
                                    : 0;

                                return (
                                  <motion.button
                                    key={nominee.id}
                                    onClick={() =>
                                      handleSetWinner(category.id, nominee.id)
                                    }
                                    disabled={loading}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full rounded-xl p-3 text-left transition-all ${
                                      isWinner
                                        ? "bg-amber-500/10 border-2 border-amber-500/50 ring-1 ring-amber-500/20"
                                        : "bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`font-semibold text-sm ${
                                            isWinner
                                              ? "text-amber-400"
                                              : "text-white"
                                          }`}
                                        >
                                          {nominee.namePtBr}
                                          {isWinner && (
                                            <Trophy className="w-3.5 h-3.5 inline ml-1.5 -mt-0.5" />
                                          )}
                                        </p>
                                        <p className="text-zinc-500 text-xs truncate mt-0.5">
                                          {nominee.name !== nominee.namePtBr
                                            ? nominee.name
                                            : nominee.details}
                                        </p>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-zinc-400 text-xs font-medium tabular-nums">
                                          {count}{" "}
                                          <span className="text-zinc-600">
                                            {count === 1 ? "voto" : "votos"}
                                          </span>
                                        </p>
                                        <p className="text-zinc-600 text-[10px] tabular-nums">
                                          {percentage}%
                                        </p>
                                      </div>
                                    </div>

                                    {/* Vote percentage bar */}
                                    <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                      <motion.div
                                        className={`h-full rounded-full ${
                                          isWinner
                                            ? "bg-amber-400"
                                            : "bg-zinc-600"
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: `${percentage}%`,
                                        }}
                                        transition={{
                                          duration: 0.5,
                                          ease: "easeOut",
                                        }}
                                      />
                                    </div>

                                    {!isWinner && (
                                      <p className="text-zinc-600 text-[10px] mt-2 text-center">
                                        Definir vencedor
                                      </p>
                                    )}
                                  </motion.button>
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

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/60">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3 px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </Link>
          <Link
            href="/votar"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] font-medium">Palpites</span>
          </Link>
          <Link
            href="/ranking"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ranking</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-amber-400">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold">Apuração</span>
          </div>
        </div>
      </div>

      <Toast message={toast} show={!!toast} onHide={() => setToast("")} />
    </main>
  );
}

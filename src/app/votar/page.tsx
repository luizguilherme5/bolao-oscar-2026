"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";
import { categories, nominees, categoryGroups } from "@/lib/data";
import type { VoteData } from "@/app/api/votes/route";

export default function VotarPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [votes, setVotes] = useState<VoteData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth").then((r) => r.json()),
      fetch("/api/votes").then((r) => r.json()),
    ]).then(([authData, votesData]) => {
      if (!authData.user) {
        router.push("/entrar");
        return;
      }
      setUser(authData.user);
      setVotes(votesData.votes || {});
      setLoading(false);
    });
  }, [router]);

  const saveVotes = useCallback(async (newVotes: VoteData) => {
    setSaving(true);
    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: newVotes }),
      });
      setToast("Salvo!");
    } catch {
      setToast("Erro ao salvar!");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleVote = useCallback((categoryId: string, nomineeId: string, type: "willWin" | "wantToWin") => {
    setVotes((prev) => {
      const newVotes = {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [type]: nomineeId,
        },
      };
      // Debounced save
      saveVotes({ [categoryId]: newVotes[categoryId] });
      return newVotes;
    });
  }, [saveVotes]);

  const completedCount = Object.values(votes).filter(
    (v) => v.willWin && v.wantToWin
  ).length;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="text-5xl"
        >
          🎬
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-carnival-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <Link href="/" className="text-2xl">🏆</Link>
          <div className="text-center flex-1">
            <p className="font-display text-sm text-golden">Bolão do Oscar 2026</p>
            <p className="text-white/40 text-xs font-body">
              {completedCount}/24 categorias completas
            </p>
          </div>
          <button onClick={handleLogout} className="text-white/40 text-xs font-body hover:text-white/60">
            Sair
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-carnival-pink via-carnival-purple to-carnival-blue"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 24) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Welcome */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl text-white mb-1">
            Fala, {user?.name}! 👋
          </h1>
          <p className="text-white/50 font-body text-sm">
            Escolha seus palpites em cada categoria. Você pode mudar depois!
          </p>
        </motion.div>
      </div>

      {/* Categories by group */}
      <div className="px-4 max-w-lg mx-auto space-y-8">
        {categoryGroups.map((group, groupIndex) => {
          const groupCategories = categories.filter((c) => c.group === group.id);

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.15 }}
            >
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{group.emoji}</span>
                <div>
                  <h2 className="font-display text-xl text-white">{group.name}</h2>
                  <p className="text-white/40 text-xs font-body">{group.description}</p>
                </div>
              </div>

              {/* Category cards */}
              <div className="space-y-3">
                {groupCategories.map((category) => {
                  const categoryVotes = votes[category.id] || {};
                  const isExpanded = expandedCategory === category.id;
                  const isComplete = categoryVotes.willWin && categoryVotes.wantToWin;
                  const categoryNominees = nominees[category.id] || [];

                  return (
                    <motion.div
                      key={category.id}
                      layout
                      className={`glass-card rounded-2xl overflow-hidden transition-all ${
                        isComplete ? "border-carnival-green/30" : ""
                      }`}
                    >
                      {/* Category header (clickable) */}
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors"
                      >
                        <span className="text-xl">{category.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-white text-sm truncate">
                            {category.name}
                          </p>
                          {!isExpanded && categoryVotes.willWin && (
                            <p className="text-white/40 text-xs truncate font-body">
                              🏆 {categoryNominees.find((n) => n.id === categoryVotes.willWin)?.name}
                              {categoryVotes.wantToWin && ` · ❤️ ${categoryNominees.find((n) => n.id === categoryVotes.wantToWin)?.name}`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isComplete && (
                            <span className="text-carnival-green text-sm">✓</span>
                          )}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-white/40 text-sm"
                          >
                            ▼
                          </motion.span>
                        </div>
                      </button>

                      {/* Expanded nominees */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-2">
                              {/* Legend */}
                              <div className="flex gap-4 text-xs text-white/40 font-body pb-2 border-b border-white/5">
                                <span>🏆 = vai ganhar</span>
                                <span>❤️ = quero que ganhe</span>
                              </div>

                              {categoryNominees.map((nominee) => {
                                const isWillWin = categoryVotes.willWin === nominee.id;
                                const isWantToWin = categoryVotes.wantToWin === nominee.id;

                                return (
                                  <div
                                    key={nominee.id}
                                    className={`rounded-xl p-3 transition-all ${
                                      isWillWin || isWantToWin
                                        ? "bg-white/8"
                                        : "bg-white/3"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-body font-bold text-white text-sm">
                                          {nominee.name}
                                        </p>
                                        <p className="text-white/40 text-xs font-body truncate">
                                          {nominee.details}
                                        </p>
                                      </div>
                                      <div className="flex gap-1.5 shrink-0">
                                        <button
                                          onClick={() => handleVote(category.id, nominee.id, "willWin")}
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90 ${
                                            isWillWin
                                              ? "bg-carnival-yellow/20 border-2 border-carnival-yellow shadow-lg shadow-carnival-yellow/20"
                                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                                          }`}
                                        >
                                          🏆
                                        </button>
                                        <button
                                          onClick={() => handleVote(category.id, nominee.id, "wantToWin")}
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90 ${
                                            isWantToWin
                                              ? "bg-carnival-pink/20 border-2 border-carnival-pink shadow-lg shadow-carnival-pink/20"
                                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                                          }`}
                                        >
                                          ❤️
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating save indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="glass-card-bright rounded-full px-4 py-2 flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              🎬
            </motion.span>
            <span className="text-xs font-body text-white/60">Salvando...</span>
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
          <div className="flex flex-col items-center gap-1 text-carnival-pink">
            <span className="text-xl">🎬</span>
            <span className="text-[10px] font-body font-bold">Votar</span>
          </div>
          <Link href="/ranking" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-xl">📊</span>
            <span className="text-[10px] font-body">Ranking</span>
          </Link>
        </div>
      </div>

      <Toast message={toast} show={!!toast} onHide={() => setToast("")} />
    </main>
  );
}

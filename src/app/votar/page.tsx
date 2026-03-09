"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Heart,
  ChevronDown,
  Check,
  Home,
  Film,
  BarChart3,
  Shield,
  LogOut,
  Loader2,
} from "lucide-react";
import Toast from "@/components/Toast";
import {
  categories,
  nominees,
  categoryGroups,
  getNomineeFilmId,
  filmNamesPtBr,
} from "@/lib/data";
import type { VoteData } from "@/app/api/votes/route";

export default function VotarPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    isAdmin?: boolean;
  } | null>(null);
  const [votes, setVotes] = useState<VoteData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [votingLocked, setVotingLocked] = useState(false);

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
      setVotingLocked(votesData.votingLocked || false);
      setLoading(false);
    });
  }, [router]);

  const saveVotes = useCallback(async (newVotes: VoteData) => {
    if (votingLocked) {
      setToast("Votação encerrada!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: newVotes }),
      });
      const data = await res.json();
      if (data.error) {
        setToast(data.error);
      } else {
        setToast("Salvo!");
      }
    } catch {
      setToast("Erro ao salvar!");
    } finally {
      setSaving(false);
    }
  }, [votingLocked]);

  const handleVote = useCallback(
    (categoryId: string, nomineeId: string, type: "willWin" | "wantToWin") => {
      setVotes((prev) => {
        const current = prev[categoryId]?.[type];
        const newVotes = {
          ...prev,
          [categoryId]: {
            ...prev[categoryId],
            [type]: current === nomineeId ? undefined : nomineeId,
          },
        };
        saveVotes({ [categoryId]: newVotes[categoryId] });
        return newVotes;
      });
    },
    [saveVotes]
  );

  const completedCount = Object.values(votes).filter(
    (v) => v.willWin && v.wantToWin
  ).length;

  const totalCategories = categories.length;
  const progressPct = (completedCount / totalCategories) * 100;

  // Compute top films based on willWin picks
  const topFilms = useMemo(() => {
    const filmCounts: Record<string, number> = {};
    for (const [categoryId, vote] of Object.entries(votes)) {
      if (vote.willWin) {
        const filmId = getNomineeFilmId(categoryId, vote.willWin);
        if (filmId) {
          filmCounts[filmId] = (filmCounts[filmId] || 0) + 1;
        }
      }
    }
    return Object.entries(filmCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([filmId, count]) => ({
        filmId,
        name: filmNamesPtBr[filmId] || filmId,
        count,
      }));
  }, [votes]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-amber-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <Link href="/" className="text-amber-500">
            <Trophy className="w-6 h-6" />
          </Link>
          <div className="text-center flex-1 mx-4">
            <p className="font-semibold text-sm text-zinc-100">
              Bolao do Oscar 2026
            </p>
            <p className="text-zinc-500 text-xs">
              {completedCount}/{totalCategories} categorias completas
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-zinc-900">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Welcome */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-bold text-2xl text-zinc-100 mb-1">
            Fala, {user?.name}!
          </h1>
          <p className="text-zinc-500 text-sm">
            {votingLocked
              ? "A votação foi encerrada. Acompanhe a apuração no ranking!"
              : "Escolha seus palpites em cada categoria. Voce pode mudar depois!"}
          </p>
        </motion.div>

        {votingLocked && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <Shield className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 text-sm font-semibold">Votação encerrada</p>
              <p className="text-red-400/60 text-xs">Os palpites estão travados. Acompanhe a apuração ao vivo no ranking!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Categories by group */}
      <div className="px-4 max-w-lg mx-auto space-y-8">
        {categoryGroups.map((group, groupIndex) => {
          const groupCategories = categories.filter(
            (c) => c.group === group.id
          );

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.12 }}
            >
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-zinc-100">
                      {group.name}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        group.points === 3
                          ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                          : group.points === 2
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          : "bg-zinc-700/40 text-zinc-400 border border-zinc-600/30"
                      }`}
                    >
                      {group.points} pts
                    </span>
                  </div>
                  <p className="text-zinc-600 text-xs mt-0.5">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Category cards */}
              <div className="space-y-2">
                {groupCategories.map((category) => {
                  const categoryVotes = votes[category.id] || {};
                  const isExpanded = expandedCategory === category.id;
                  const isComplete =
                    categoryVotes.willWin && categoryVotes.wantToWin;
                  const categoryNominees = nominees[category.id] || [];

                  return (
                    <div
                      key={category.id}
                      className={`rounded-xl overflow-hidden border transition-colors ${
                        isComplete
                          ? "bg-zinc-900/80 border-emerald-500/20"
                          : "bg-zinc-900/60 border-zinc-800/60"
                      }`}
                    >
                      {/* Category header (clickable) */}
                      <button
                        onClick={() =>
                          setExpandedCategory(
                            isExpanded ? null : category.id
                          )
                        }
                        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-800/30 active:bg-zinc-800/50 transition-colors"
                      >
                        <span className="text-lg shrink-0 w-7 text-center text-zinc-400">
                          {getCategoryIcon(category.icon)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-200 text-sm truncate flex items-center gap-1.5">
                            {category.name}
                            {category.points !== group.points && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                {category.points} pts
                              </span>
                            )}
                          </p>
                          {!isExpanded && categoryVotes.willWin && (
                            <p className="text-zinc-500 text-xs truncate mt-0.5 flex items-center gap-1.5">
                              <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate">
                                {
                                  categoryNominees.find(
                                    (n) => n.id === categoryVotes.willWin
                                  )?.namePtBr
                                }
                              </span>
                              {categoryVotes.wantToWin && (
                                <>
                                  <span className="text-zinc-700 mx-0.5">
                                    ·
                                  </span>
                                  <Heart className="w-3 h-3 text-pink-500 shrink-0" />
                                  <span className="truncate">
                                    {
                                      categoryNominees.find(
                                        (n) =>
                                          n.id === categoryVotes.wantToWin
                                      )?.namePtBr
                                    }
                                  </span>
                                </>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isComplete && (
                            <Check className="w-4 h-4 text-emerald-500" />
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-zinc-600" />
                          </motion.div>
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
                            <div className="px-4 pb-4 space-y-1.5">
                              {/* Legend */}
                              <div className="flex gap-4 text-[11px] text-zinc-500 pb-2 mb-1 border-b border-zinc-800/60">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-amber-500" />
                                  vai ganhar
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3 text-pink-500" />
                                  quero que ganhe
                                </span>
                              </div>

                              {categoryNominees.map((nominee) => {
                                const isWillWin =
                                  categoryVotes.willWin === nominee.id;
                                const isWantToWin =
                                  categoryVotes.wantToWin === nominee.id;

                                return (
                                  <div
                                    key={nominee.id}
                                    className={`rounded-lg p-3 transition-all ${
                                      isWillWin || isWantToWin
                                        ? "bg-zinc-800/70"
                                        : "bg-zinc-800/30 hover:bg-zinc-800/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-zinc-200 text-sm leading-tight">
                                          {nominee.namePtBr}
                                        </p>
                                        {nominee.namePtBr !== nominee.name && (
                                          <p className="text-zinc-600 text-[11px] leading-tight mt-0.5">
                                            {nominee.name}
                                          </p>
                                        )}
                                        <p className="text-zinc-500 text-xs truncate mt-0.5">
                                          {nominee.details}
                                        </p>
                                      </div>
                                      <div className="flex gap-1.5 shrink-0">
                                        <button
                                          onClick={() =>
                                            handleVote(
                                              category.id,
                                              nominee.id,
                                              "willWin"
                                            )
                                          }
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                                            isWillWin
                                              ? "bg-amber-500/20 border-2 border-amber-500 shadow-lg shadow-amber-500/20"
                                              : "bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-700/60 hover:border-zinc-600"
                                          }`}
                                        >
                                          <Trophy
                                            className={`w-4 h-4 ${
                                              isWillWin
                                                ? "text-amber-500"
                                                : "text-zinc-500"
                                            }`}
                                          />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleVote(
                                              category.id,
                                              nominee.id,
                                              "wantToWin"
                                            )
                                          }
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                                            isWantToWin
                                              ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
                                              : "bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-700/60 hover:border-zinc-600"
                                          }`}
                                        >
                                          <Heart
                                            className={`w-4 h-4 ${
                                              isWantToWin
                                                ? "text-pink-500"
                                                : "text-zinc-500"
                                            }`}
                                          />
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
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Top Films Section */}
        {topFilms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg text-zinc-100">
                Seus Filmes Mais Premiados
              </h2>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 overflow-hidden divide-y divide-zinc-800/40">
              {topFilms.map((film, i) => (
                <div
                  key={film.filmId}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    className={`text-sm font-bold w-6 text-center ${
                      i === 0
                        ? "text-amber-500"
                        : i === 1
                        ? "text-zinc-400"
                        : i === 2
                        ? "text-amber-700"
                        : "text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-200 text-sm truncate">
                      {film.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-500">
                      {film.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-zinc-600 text-xs mt-2 text-center">
              Baseado nos seus palpites de &quot;vai ganhar&quot;
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating save indicator */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-4 z-40"
          >
            <div className="bg-zinc-800 border border-zinc-700/60 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="text-xs text-zinc-400">Salvando...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/60">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3 px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Inicio</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-amber-500">
            <Film className="w-5 h-5" />
            <span className="text-[10px] font-bold">Palpites</span>
          </div>
          <Link
            href="/ranking"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">Ranking</span>
          </Link>
          {user?.isAdmin && (
            <Link
              href="/apuracao"
              className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px]">Apuracao</span>
            </Link>
          )}
        </div>
      </div>

      <Toast message={toast} show={!!toast} onHide={() => setToast("")} />
    </main>
  );
}

/** Maps lucide icon name strings from data.ts to JSX icon elements */
function getCategoryIcon(iconName: string) {
  // Using a simple inline approach — these are small functional icons
  // that don't warrant dynamic imports
  const iconMap: Record<string, React.ReactNode> = {
    clapperboard: <Film className="w-5 h-5" />,
    megaphone: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    "pen-tool": (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    "book-open": (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    palette: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    globe: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    video: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    ),
    music: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    mic: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
    camera: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
      </svg>
    ),
    scissors: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
      </svg>
    ),
    layout: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" />
      </svg>
    ),
    shirt: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
    sparkles: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
      </svg>
    ),
    "volume-2": (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
    zap: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    contact: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" /><rect width="18" height="18" x="3" y="4" rx="2" /><circle cx="12" cy="10" r="2" /><line x1="8" x2="8" y1="2" y2="4" /><line x1="16" x2="16" y1="2" y2="4" />
      </svg>
    ),
    film: <Film className="w-5 h-5" />,
    image: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  };

  return iconMap[iconName] || <Film className="w-5 h-5" />;
}

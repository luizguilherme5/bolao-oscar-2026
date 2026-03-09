"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Check,
  X,
  ChevronDown,
  Medal,
  Award,
  Home,
  Film,
  BarChart3,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { categories, nominees, groupInfo } from "@/lib/data";
import type { RankingEntry, FilmAwardCount } from "@/app/api/ranking/route";

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [winnersCount, setWinnersCount] = useState(0);
  const [maxWillWinScore, setMaxWillWinScore] = useState(41);
  const [actualTopFilms, setActualTopFilms] = useState<FilmAwardCount[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/ranking").then((r) => r.json()),
      fetch("/api/auth").then((r) => r.json()),
    ]).then(([rankingData, authData]) => {
      setRankings(rankingData.rankings || []);
      setWinners(rankingData.winners || {});
      setWinnersCount(rankingData.winnersCount || 0);
      setMaxWillWinScore(rankingData.maxWillWinScore || 41);
      setActualTopFilms(rankingData.actualTopFilms || []);
      setIsAdmin(authData.user?.isAdmin || false);
      setLoading(false);
    });
  }, []);

  const hasWinners = winnersCount > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Trophy className="w-10 h-10 text-amber-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                Ranking
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                {winnersCount} de 24 apuradas
              </p>
            </div>
            {hasWinners && (
              <div className="badge badge-gold">
                <TrendingUp className="w-3 h-3 mr-1" />
                Ao vivo
              </div>
            )}
          </div>

          {/* Progress bar */}
          {hasWinners && (
            <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(winnersCount / 24) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Ranking List */}
      <div className="px-4 pt-4 max-w-lg mx-auto space-y-2">
        {rankings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-semibold">
              Nenhum participante ainda
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Seja o primeiro a dar seus palpites
            </p>
          </div>
        ) : (
          rankings.map((entry, index) => {
            const position = index + 1;
            const isExpanded = expandedUser === entry.userId;

            // Score breakdown for subtitle
            const willWinLabel = `${entry.willWinScore} acertos`;
            const filmLabel =
              entry.filmBonusScore > 0
                ? ` + ${entry.filmBonusScore} filme`
                : "";
            const wantLabel =
              entry.wantToWinScore > 0
                ? ` + ${entry.wantToWinScore} quero`
                : "";
            const breakdownText = `${willWinLabel}${filmLabel}${wantLabel}`;

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                layout
              >
                <button
                  onClick={() =>
                    setExpandedUser(isExpanded ? null : entry.userId)
                  }
                  className={`w-full card overflow-hidden text-left transition-all active:scale-[0.99] ${
                    position <= 3 && hasWinners
                      ? "border-amber-500/20"
                      : ""
                  }`}
                >
                  <div className="px-4 py-3.5 flex items-center gap-3">
                    {/* Position / Medal */}
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                      {position === 1 && hasWinners ? (
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
                          <Medal className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                      ) : position === 2 && hasWinners ? (
                        <div className="w-8 h-8 rounded-full bg-zinc-400/10 flex items-center justify-center">
                          <Medal className="w-4.5 h-4.5 text-zinc-400" />
                        </div>
                      ) : position === 3 && hasWinners ? (
                        <div className="w-8 h-8 rounded-full bg-orange-700/15 flex items-center justify-center">
                          <Award className="w-4.5 h-4.5 text-orange-600" />
                        </div>
                      ) : (
                        <span className="text-zinc-500 font-bold text-sm">
                          {position}
                        </span>
                      )}
                    </div>

                    {/* Name + breakdown */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-100 truncate text-sm">
                        {entry.name}
                      </p>
                      {hasWinners ? (
                        <p className="text-zinc-500 text-[11px] mt-0.5 truncate">
                          {breakdownText}
                        </p>
                      ) : (
                        <p className="text-zinc-600 text-[11px] mt-0.5">
                          {entry.totalCategories} categorias preenchidas
                        </p>
                      )}
                    </div>

                    {/* Total Score */}
                    <div className="text-right shrink-0 mr-1">
                      {hasWinners ? (
                        <p
                          className={`font-extrabold text-xl tabular-nums ${
                            position === 1
                              ? "text-amber-400"
                              : position <= 3
                              ? "text-zinc-100"
                              : "text-zinc-300"
                          }`}
                        >
                          {entry.totalScore % 1 === 0
                            ? entry.totalScore
                            : entry.totalScore.toFixed(1)}
                        </p>
                      ) : (
                        <p className="text-zinc-600 font-bold text-lg">-</p>
                      )}
                      {hasWinners && (
                        <p className="text-zinc-600 text-[10px] font-medium">
                          pts
                        </p>
                      )}
                    </div>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-zinc-600" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="card -mt-[1px] rounded-t-none border-t-0 px-4 pb-4 pt-3">
                        {/* Score summary badges */}
                        {hasWinners && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="badge badge-gold">
                              <Trophy className="w-3 h-3 mr-1" />
                              Acertos: {entry.willWinScore}/{maxWillWinScore}
                            </span>
                            {entry.filmBonusScore > 0 && (
                              <span className="badge badge-purple">
                                <Film className="w-3 h-3 mr-1" />
                                Filme: +{entry.filmBonusScore}
                              </span>
                            )}
                            {entry.wantToWinScore > 0 && (
                              <span className="badge badge-pink">
                                <Star className="w-3 h-3 mr-1" />
                                Quero: +{entry.wantToWinScore}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Category details grouped */}
                        {(["BIG_SIX", "MAJOR", "TECHNICAL"] as const).map(
                          (groupId) => {
                            const groupCats = categories.filter(
                              (c) => c.group === groupId
                            );
                            const info = groupInfo[groupId];

                            return (
                              <div key={groupId} className="mb-3 last:mb-0">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                    {info.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-600">
                                    ({info.points}pt)
                                  </span>
                                </div>

                                <div className="space-y-0.5">
                                  {groupCats.map((cat) => {
                                    const detail =
                                      entry.willWinDetails[cat.id];
                                    const winner = winners[cat.id];
                                    const nomineeList =
                                      nominees[cat.id] || [];

                                    if (!detail) {
                                      return (
                                        <div
                                          key={cat.id}
                                          className="flex items-center gap-2 py-1 opacity-30"
                                        >
                                          <span className="text-[11px] text-zinc-500 flex-1 truncate">
                                            {cat.name}
                                          </span>
                                          <span className="text-[11px] text-zinc-600">
                                            --
                                          </span>
                                        </div>
                                      );
                                    }

                                    const pickedNominee = nomineeList.find(
                                      (n) => n.id === detail.picked
                                    );

                                    return (
                                      <div
                                        key={cat.id}
                                        className="flex items-center gap-2 py-1"
                                      >
                                        <span className="text-[11px] text-zinc-500 shrink-0 w-[110px] truncate">
                                          {cat.name}
                                        </span>
                                        <span className="text-[11px] text-zinc-300 flex-1 truncate">
                                          {pickedNominee?.name || "--"}
                                        </span>
                                        {detail.correct === true && (
                                          <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-500" />
                                          </div>
                                        )}
                                        {detail.correct === false && (
                                          <div className="w-4 h-4 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                                            <X className="w-3 h-3 text-red-500" />
                                          </div>
                                        )}
                                        {detail.correct === null &&
                                          !winner && (
                                            <div className="w-4 h-4 rounded-full bg-zinc-700/50 flex items-center justify-center shrink-0">
                                              <span className="text-[8px] text-zinc-500">
                                                ?
                                              </span>
                                            </div>
                                          )}
                                        {detail.correct !== null &&
                                          hasWinners &&
                                          detail.points > 0 && (
                                            <span className="text-[10px] text-amber-500 font-bold shrink-0">
                                              +{detail.points}
                                            </span>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }
                        )}

                        {/* Film Bonus details */}
                        {entry.filmBonusDetails.length > 0 && hasWinners && (
                          <div className="mt-3 pt-3 border-t border-zinc-800">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Film className="w-3 h-3 text-purple-400" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                Bonus Filmes
                              </span>
                            </div>
                            <div className="space-y-1">
                              {entry.filmBonusDetails.map((fb, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-[11px]"
                                >
                                  <span className="text-zinc-600 shrink-0 w-4 text-center font-bold">
                                    {fb.predictedPos}
                                  </span>
                                  <span className="text-zinc-400 flex-1 truncate">
                                    {fb.filmName}
                                  </span>
                                  {fb.bonus === 2 && (
                                    <span className="badge badge-gold text-[9px] py-0">
                                      Exato +2
                                    </span>
                                  )}
                                  {fb.bonus === 1 && (
                                    <span className="badge badge-blue text-[9px] py-0">
                                      Top 5 +1
                                    </span>
                                  )}
                                  {fb.bonus === 0 && fb.actualPos === null && (
                                    <span className="text-zinc-600">--</span>
                                  )}
                                  {fb.bonus === 0 && fb.actualPos !== null && (
                                    <span className="text-zinc-600">
                                      <X className="w-3 h-3 inline" />
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Most Awarded Films */}
      {actualTopFilms.length > 0 && (
        <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-300">
              Filmes Mais Premiados
            </h2>
          </div>
          <div className="card overflow-hidden">
            {actualTopFilms.slice(0, 8).map((film, i) => (
              <div
                key={film.filmId}
                className={`flex items-center gap-3 px-4 py-2.5 ${
                  i > 0 ? "border-t border-zinc-800/60" : ""
                }`}
              >
                <span
                  className={`text-sm font-bold tabular-nums ${
                    i === 0
                      ? "text-amber-400"
                      : i <= 2
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-300 flex-1 truncate">
                  {film.filmName}
                </span>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500/60" />
                  <span className="text-sm font-bold text-amber-500 tabular-nums">
                    {film.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/60">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2.5 px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors py-1 px-3"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </Link>
          <Link
            href="/votar"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors py-1 px-3"
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] font-medium">Palpites</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-amber-500 py-1 px-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Ranking</span>
          </div>
          {isAdmin && (
            <Link
              href="/apuracao"
              className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors py-1 px-3"
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-medium">Apuracao</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

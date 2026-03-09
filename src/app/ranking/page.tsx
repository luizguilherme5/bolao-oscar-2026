"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Medal,
  Award,
  Home,
  Film,
  BarChart3,
  Shield,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  GitCompareArrows,
  Crown,
  Lock,
} from "lucide-react";
import { categories, nominees, groupInfo } from "@/lib/data";
import type { RankingEntry, FilmAwardCount } from "@/app/api/ranking/route";
import Confetti from "@/components/Confetti";

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [winnersCount, setWinnersCount] = useState(0);
  const [maxWillWinScore, setMaxWillWinScore] = useState(43);
  const [actualTopFilms, setActualTopFilms] = useState<FilmAwardCount[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [compareUserId, setCompareUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votingLocked, setVotingLocked] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRanking = useCallback(async () => {
    const data = await fetch("/api/ranking").then((r) => r.json());
    setRankings(data.rankings || []);
    setWinners(data.winners || {});
    setWinnersCount(data.winnersCount || 0);
    setMaxWillWinScore(data.maxWillWinScore || 43);
    setActualTopFilms(data.actualTopFilms || []);
    setVotingLocked(data.votingLocked || false);
    setCelebration(data.celebration || false);
    return data;
  }, []);

  useEffect(() => {
    Promise.all([
      fetchRanking(),
      fetch("/api/auth").then((r) => r.json()),
    ]).then(([, authData]) => {
      setIsAdmin(authData.user?.isAdmin || false);
      setCurrentUserId(authData.user?.id || null);
      setLoading(false);
    });
  }, [fetchRanking]);

  // Polling: every 10s when apuração is active (has winners but not all done)
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    const isActive = winnersCount > 0 && winnersCount < 24;
    if (isActive) {
      pollingRef.current = setInterval(() => {
        fetchRanking();
      }, 10000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [winnersCount, fetchRanking]);

  const hasWinners = winnersCount > 0;

  const currentUserEntry = useMemo(
    () => rankings.find((r) => r.userId === currentUserId),
    [rankings, currentUserId]
  );
  const compareEntry = useMemo(
    () => rankings.find((r) => r.userId === compareUserId),
    [rankings, compareUserId]
  );

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
      {/* Celebration confetti */}
      {celebration && <Confetti count={50} />}

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
            {!votingLocked && (
              <div className="badge" style={{ background: "rgba(113,113,122,0.15)", border: "1px solid rgba(113,113,122,0.3)" }}>
                <Lock className="w-3 h-3 mr-1 text-zinc-400" />
                <span className="text-zinc-400 text-[11px] font-semibold">Palpites secretos</span>
              </div>
            )}
            {hasWinners && votingLocked && (
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

      {/* Celebration champion banner */}
      {celebration && rankings.length > 0 && (
        <div className="px-4 pt-4 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="card overflow-hidden bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 border-amber-500/30"
          >
            <div className="px-6 py-5 text-center">
              <Crown className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-400/70 text-xs font-semibold uppercase tracking-wider mb-1">
                Campeão do Bolão
              </p>
              <p className="text-2xl font-extrabold text-amber-400">
                {rankings[0].name}
              </p>
              <p className="text-amber-400/60 text-sm font-bold mt-1 tabular-nums">
                {rankings[0].totalScore % 1 === 0
                  ? rankings[0].totalScore
                  : rankings[0].totalScore.toFixed(1)}{" "}
                pontos
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Compare View */}
      <AnimatePresence>
        {votingLocked && compareUserId && currentUserEntry && compareEntry && (
          <CompareView
            currentUser={currentUserEntry}
            otherUser={compareEntry}
            winners={winners}
            onClose={() => setCompareUserId(null)}
          />
        )}
      </AnimatePresence>

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
            const isExpanded =
              expandedUser === entry.userId && compareUserId === null;
            const isCurrentUser = entry.userId === currentUserId;
            const positionDelta =
              entry.previousPosition !== null
                ? entry.previousPosition - position
                : null;

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
                    votingLocked
                      ? setExpandedUser(isExpanded ? null : entry.userId)
                      : null
                  }
                  className={`w-full card overflow-hidden text-left transition-all ${votingLocked ? "active:scale-[0.99]" : "cursor-default"} ${
                    isCurrentUser
                      ? "border-amber-500/40 bg-amber-500/[0.03]"
                      : position <= 3 && hasWinners
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
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`font-bold truncate text-sm ${
                            isCurrentUser ? "text-amber-400" : "text-zinc-100"
                          }`}
                        >
                          {entry.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[9px] font-bold text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                            Você
                          </span>
                        )}
                      </div>
                      {hasWinners && votingLocked ? (
                        <p className="text-zinc-500 text-[11px] mt-0.5 truncate">
                          {breakdownText}
                        </p>
                      ) : (
                        <p className="text-zinc-600 text-[11px] mt-0.5">
                          {entry.totalCategories} categorias preenchidas
                        </p>
                      )}
                    </div>

                    {/* Position delta arrow */}
                    {hasWinners && positionDelta !== null && (
                      <div className="shrink-0 flex items-center gap-0.5">
                        {positionDelta > 0 ? (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 tabular-nums">
                              {positionDelta}
                            </span>
                          </>
                        ) : positionDelta < 0 ? (
                          <>
                            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-[10px] font-bold text-red-400 tabular-nums">
                              {Math.abs(positionDelta)}
                            </span>
                          </>
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </div>
                    )}

                    {/* Total Score */}
                    <div className="text-right shrink-0 mr-1">
                      {hasWinners && votingLocked ? (
                        <>
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
                          <p className="text-zinc-600 text-[10px] font-medium">
                            pts
                          </p>
                        </>
                      ) : (
                        <p className="text-zinc-600 font-bold text-lg">-</p>
                      )}
                    </div>

                    {/* Chevron */}
                    {votingLocked && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-zinc-600" />
                      </motion.div>
                    )}
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
                        {/* Compare button */}
                        {currentUserId &&
                          !isCurrentUser &&
                          currentUserEntry && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompareUserId(entry.userId);
                                setExpandedUser(null);
                              }}
                              className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold hover:bg-purple-500/15 transition-colors active:scale-[0.98]"
                            >
                              <GitCompareArrows className="w-4 h-4" />
                              Comparar comigo
                            </button>
                          )}

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
                                    ({info.points}pt
                                    {groupId === "BIG_SIX" &&
                                      " · Melhor Filme = 5pt"}
                                    )
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
                                          {pickedNominee?.namePtBr ||
                                            pickedNominee?.name ||
                                            "--"}
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
                                  {fb.bonus === 0 &&
                                    fb.actualPos === null && (
                                      <span className="text-zinc-600">--</span>
                                    )}
                                  {fb.bonus === 0 &&
                                    fb.actualPos !== null && (
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

/* ─── Compare View ─── */

function CompareView({
  currentUser,
  otherUser,
  winners,
  onClose,
}: {
  currentUser: RankingEntry;
  otherUser: RankingEntry;
  winners: Record<string, string>;
  onClose: () => void;
}) {
  const hasWinners = Object.keys(winners).length > 0;

  // Count matches/differences
  const stats = useMemo(() => {
    let same = 0;
    let different = 0;
    let total = 0;
    for (const cat of categories) {
      const myPick = currentUser.willWinDetails[cat.id]?.picked;
      const theirPick = otherUser.willWinDetails[cat.id]?.picked;
      if (myPick && theirPick) {
        total++;
        if (myPick === theirPick) same++;
        else different++;
      }
    }
    return { same, different, total };
  }, [currentUser, otherUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-4 max-w-lg mx-auto"
    >
      <div className="card overflow-hidden">
        {/* Compare header */}
        <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center gap-3">
          <GitCompareArrows className="w-5 h-5 text-purple-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-100">Comparação</p>
            <p className="text-[11px] text-zinc-500">
              {stats.same} iguais · {stats.different} diferentes de{" "}
              {stats.total}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center hover:bg-zinc-700/60 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Column headers */}
        <div className="px-4 py-2 flex items-center border-b border-zinc-800/40 bg-zinc-900/30">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex-1">
            Categoria
          </span>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider w-[110px] text-center truncate">
            {currentUser.name}
          </span>
          <span className="w-5" />
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider w-[110px] text-center truncate">
            {otherUser.name}
          </span>
        </div>

        {/* Category rows grouped */}
        <div className="max-h-[60vh] overflow-y-auto">
          {(["BIG_SIX", "MAJOR", "TECHNICAL"] as const).map((groupId) => {
            const groupCats = categories.filter((c) => c.group === groupId);
            const info = groupInfo[groupId];

            return (
              <div key={groupId}>
                <div className="px-4 py-1.5 bg-zinc-900/50 border-y border-zinc-800/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {info.name}
                  </span>
                </div>

                {groupCats.map((cat) => {
                  const myDetail = currentUser.willWinDetails[cat.id];
                  const theirDetail = otherUser.willWinDetails[cat.id];
                  const nomineeList = nominees[cat.id] || [];
                  const winner = winners[cat.id];

                  const myNominee = nomineeList.find(
                    (n) => n.id === myDetail?.picked
                  );
                  const theirNominee = nomineeList.find(
                    (n) => n.id === theirDetail?.picked
                  );
                  const samePick =
                    myDetail?.picked &&
                    theirDetail?.picked &&
                    myDetail.picked === theirDetail.picked;

                  return (
                    <div
                      key={cat.id}
                      className={`px-4 py-2 flex items-center border-b border-zinc-800/20 ${
                        samePick ? "bg-emerald-500/[0.03]" : ""
                      }`}
                    >
                      <span className="text-[10px] text-zinc-500 flex-1 truncate pr-2">
                        {cat.name}
                      </span>
                      <div className="w-[110px] flex items-center justify-center gap-1">
                        <span
                          className={`text-[10px] truncate text-center ${
                            myDetail?.correct === true
                              ? "text-emerald-400 font-bold"
                              : myDetail?.correct === false
                              ? "text-red-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {myNominee?.namePtBr || "--"}
                        </span>
                        {myDetail?.correct === true && (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                        {myDetail?.correct === false && (
                          <X className="w-3 h-3 text-red-400 shrink-0" />
                        )}
                      </div>
                      <div className="w-5 flex items-center justify-center">
                        {samePick ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        )}
                      </div>
                      <div className="w-[110px] flex items-center justify-center gap-1">
                        <span
                          className={`text-[10px] truncate text-center ${
                            theirDetail?.correct === true
                              ? "text-emerald-400 font-bold"
                              : theirDetail?.correct === false
                              ? "text-red-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {theirNominee?.namePtBr || "--"}
                        </span>
                        {theirDetail?.correct === true && (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                        {theirDetail?.correct === false && (
                          <X className="w-3 h-3 text-red-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Score comparison footer */}
        {hasWinners && (
          <div className="px-4 py-3 border-t border-zinc-800/60 flex items-center bg-zinc-900/30">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex-1">
              Total
            </span>
            <span className="text-sm font-extrabold text-amber-400 w-[110px] text-center tabular-nums">
              {currentUser.totalScore % 1 === 0
                ? currentUser.totalScore
                : currentUser.totalScore.toFixed(1)}
            </span>
            <span className="w-5 text-center text-[10px] text-zinc-600">
              vs
            </span>
            <span className="text-sm font-extrabold text-purple-400 w-[110px] text-center tabular-nums">
              {otherUser.totalScore % 1 === 0
                ? otherUser.totalScore
                : otherUser.totalScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

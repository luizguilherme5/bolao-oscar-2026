"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { Trophy, ChevronRight, Users, Calendar, Film, Award } from "lucide-react";
import type { RankingEntry } from "@/app/api/ranking/route";

export default function Home() {
  const [topRanking, setTopRanking] = useState<RankingEntry[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then((d) => {
      if (d.user) setUser(d.user);
    });
    fetch("/api/ranking").then((r) => r.json()).then((d) => {
      if (d.rankings) {
        setTopRanking(d.rankings.slice(0, 3));
        setParticipantCount(d.rankings.length);
      }
    });
  }, []);

  const medalColors = [
    "text-amber-400",
    "text-zinc-400",
    "text-amber-700",
  ];

  return (
    <main className="min-h-screen bg-zinc-950 bg-app">
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-4 pb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Trophy className="w-8 h-8 text-amber-500" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-shimmer">
              Bolao do Oscar 2026
            </h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">
            Amigos da Rua
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card p-5 mb-6"
        >
          <p className="text-center text-zinc-500 text-xs font-semibold mb-4 uppercase tracking-wider">
            A cerimonia comeca em
          </p>
          <Countdown />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="card p-3 text-center">
            <Users className="w-4 h-4 text-purple-500 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-zinc-100">{participantCount}</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">participantes</p>
          </div>
          <div className="card p-3 text-center">
            <Film className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-zinc-100">24</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">categorias</p>
          </div>
          <div className="card p-3 text-center">
            <Calendar className="w-4 h-4 text-purple-500 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-zinc-100">15 Mar</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">cerimonia</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col gap-3 mb-6"
        >
          {user && (
            <p className="text-zinc-500 text-sm text-center mb-1">
              Fala, <span className="text-amber-500 font-bold">{user.name}</span>!
            </p>
          )}

          <Link
            href={user ? "/votar" : "/entrar"}
            className="group flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-base py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            <Award className="w-5 h-5" />
            {user ? "Meus Palpites" : "Entrar no Bolao"}
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/ranking"
            className="group flex items-center justify-center gap-2 w-full card hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-semibold text-base py-3 px-6 transition-all duration-200 active:scale-[0.98]"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Ver Ranking
            <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Mini Ranking Preview */}
        {topRanking.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="card p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-300">Top 3</h3>
              <span className="badge badge-purple">ao vivo</span>
            </div>
            <div className="space-y-2">
              {topRanking.map((entry, i) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/50"
                >
                  <span className={`text-sm font-extrabold w-5 ${medalColors[i]}`}>
                    {i + 1}
                  </span>
                  <Award className={`w-4 h-4 ${medalColors[i]}`} />
                  <span className="font-semibold text-sm text-zinc-200 flex-1 truncate">
                    {entry.name}
                  </span>
                  <span className="text-amber-500 font-bold text-sm tabular-nums">
                    {entry.totalScore} pts
                  </span>
                </div>
              ))}
            </div>
            {participantCount > 3 && (
              <Link
                href="/ranking"
                className="flex items-center justify-center gap-1 text-zinc-500 hover:text-zinc-400 text-xs font-medium mt-3 transition-colors"
              >
                +{participantCount - 3} participantes
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-center py-6 space-y-3"
        >
          <Link
            href="/apuracao"
            className="text-zinc-600 text-xs font-medium hover:text-zinc-400 transition-colors"
          >
            Modo Apuracao
          </Link>
          <p className="text-zinc-700 text-xs">
            Feito com amor pelos Amigos da Rua
          </p>
        </motion.footer>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import Countdown from "@/components/Countdown";
import { funPhrases } from "@/lib/data";
import type { RankingEntry } from "@/app/api/ranking/route";

export default function Home() {
  const [phrase, setPhrase] = useState(funPhrases[0]);
  const [topRanking, setTopRanking] = useState<RankingEntry[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(funPhrases[Math.floor(Math.random() * funPhrases.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main className="min-h-screen flex flex-col">
      <Confetti count={25} />

      {/* Header */}
      <div className="relative z-10 px-4 pt-8 pb-4 text-center">
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-6xl sm:text-7xl mb-4"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-golden mb-2"
        >
          Bolão do Oscar
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <span className="text-carnival-yellow font-display text-xl sm:text-2xl">2026</span>
          <span className="text-white/40">|</span>
          <span className="text-carnival-pink font-display text-lg sm:text-xl">98th Academy Awards</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/50 font-body text-sm tracking-widest uppercase"
        >
          Amigos da Rua
        </motion.p>
      </div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="px-4 py-6"
      >
        <p className="text-center text-white/60 text-sm font-body mb-3 uppercase tracking-wider">
          A cerimônia começa em
        </p>
        <Countdown />
      </motion.div>

      {/* Fun phrase */}
      <motion.div
        key={phrase}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="px-6 py-4 text-center"
      >
        <p className="font-body font-bold text-lg sm:text-xl text-white/80 italic">
          &ldquo;{phrase}&rdquo;
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="px-6 py-4 flex flex-col items-center gap-3"
      >
        {user ? (
          <>
            <p className="text-white/60 font-body text-sm">
              Fala, <span className="text-carnival-yellow font-bold">{user.name}</span>! 👋
            </p>
            <Link
              href="/votar"
              className="w-full max-w-sm bg-gradient-to-r from-carnival-pink to-carnival-purple text-white font-display text-xl py-4 px-8 rounded-2xl text-center btn-glow transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-carnival-pink/20"
            >
              Dar meus palpites 🎬
            </Link>
          </>
        ) : (
          <Link
            href="/entrar"
            className="w-full max-w-sm bg-gradient-to-r from-carnival-pink to-carnival-purple text-white font-display text-xl py-4 px-8 rounded-2xl text-center btn-glow transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-carnival-pink/20"
          >
            Entrar no Bolão 🍿
          </Link>
        )}

        <Link
          href="/ranking"
          className="w-full max-w-sm glass-card text-white font-body font-bold text-lg py-3 px-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Ver Ranking 📊
        </Link>
      </motion.div>

      {/* Mini ranking preview */}
      {topRanking.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="px-6 py-6"
        >
          <div className="glass-card rounded-2xl p-5 max-w-sm mx-auto">
            <h3 className="font-display text-lg text-carnival-yellow mb-3 text-center">
              Top 3 do Momento
            </h3>
            <div className="space-y-2">
              {topRanking.map((entry, i) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5"
                >
                  <span className="text-xl">{medals[i]}</span>
                  <span className="font-body font-bold text-white flex-1 truncate">{entry.name}</span>
                  <span className="text-carnival-yellow font-display text-sm">
                    {entry.willWinScore} pts
                  </span>
                </div>
              ))}
            </div>
            {participantCount > 3 && (
              <p className="text-center text-white/40 text-xs mt-3 font-body">
                +{participantCount - 3} participantes
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="px-6 py-4 flex justify-center gap-8"
      >
        <div className="text-center">
          <p className="text-2xl font-display text-carnival-purple">{participantCount}</p>
          <p className="text-xs text-white/50 font-body uppercase tracking-wider">participantes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-display text-carnival-blue">24</p>
          <p className="text-xs text-white/50 font-body uppercase tracking-wider">categorias</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-display text-carnival-green">15 Mar</p>
          <p className="text-xs text-white/50 font-body uppercase tracking-wider">cerimônia</p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto px-6 py-6 text-center space-y-3">
        <Link
          href="/apuracao"
          className="text-white/30 text-xs font-body hover:text-white/50 transition-colors"
        >
          🔐 Modo Apuração
        </Link>
        <p className="text-white/20 text-xs font-body">
          Feito com 🍿 pelos Amigos da Rua
        </p>
      </div>
    </main>
  );
}

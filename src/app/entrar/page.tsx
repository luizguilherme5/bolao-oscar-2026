"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EntrarPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name: mode === "register" ? name : undefined,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        router.push("/votar");
      }
    } catch {
      setError("Erro de conexão. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl"
        >
          🎬
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="font-display text-3xl text-golden text-center mb-2">
          {mode === "register" ? "Entrar no Bolão" : "Bem-vindo de volta"}
        </h1>
        <p className="text-white/50 text-center font-body text-sm mb-8">
          {mode === "register"
            ? "Crie sua conta e dê seus palpites!"
            : "Acesse sua conta pra ver ou editar palpites"}
        </p>

        {/* Mode toggle */}
        <div className="flex gap-1 mb-6 glass-card rounded-xl p-1">
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-body font-bold text-sm transition-all ${
              mode === "register"
                ? "bg-gradient-to-r from-carnival-pink to-carnival-purple text-white"
                : "text-white/50"
            }`}
          >
            Criar conta
          </button>
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-body font-bold text-sm transition-all ${
              mode === "login"
                ? "bg-gradient-to-r from-carnival-pink to-carnival-purple text-white"
                : "text-white/50"
            }`}
          >
            Já tenho conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="block text-white/60 text-xs font-body font-bold uppercase tracking-wider mb-1.5">
                Seu nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como a galera te chama?"
                required={mode === "register"}
                className="w-full glass-card rounded-xl px-4 py-3 font-body text-white placeholder:text-white/30 bg-transparent"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-white/60 text-xs font-body font-bold uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full glass-card rounded-xl px-4 py-3 font-body text-white placeholder:text-white/30 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-body font-bold uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              required
              minLength={4}
              className="w-full glass-card rounded-xl px-4 py-3 font-body text-white placeholder:text-white/30 bg-transparent"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-carnival-pink text-sm font-body font-bold text-center bg-carnival-pink/10 rounded-xl py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-carnival-pink to-carnival-purple text-white font-display text-lg py-4 rounded-2xl btn-glow transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-carnival-pink/20"
          >
            {loading ? (
              <span className="animate-pulse">Entrando... 🎬</span>
            ) : mode === "register" ? (
              "Criar conta e votar 🍿"
            ) : (
              "Entrar 🎥"
            )}
          </button>
        </form>
      </motion.div>

      <Link
        href="/"
        className="mt-8 text-white/30 font-body text-sm hover:text-white/50 transition-colors"
      >
        ← Voltar pro início
      </Link>
    </main>
  );
}

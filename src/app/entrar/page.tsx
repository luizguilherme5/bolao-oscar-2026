"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, LogIn, UserPlus, ArrowLeft, Loader2 } from "lucide-react";

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
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-purple-600/15 flex items-center justify-center"
        >
          <Film className="w-7 h-7 text-purple-500" />
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-zinc-100 text-center mb-1">
          {mode === "register" ? "Entrar no Bolão" : "Bem-vindo de volta"}
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">
          {mode === "register"
            ? "Crie sua conta e dê seus palpites!"
            : "Acesse sua conta para ver ou editar palpites"}
        </p>

        {/* Mode toggle */}
        <div className="flex gap-1 mb-6 card p-1">
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === "register"
                ? "bg-purple-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Criar conta
          </button>
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-purple-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Já tenho conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="block text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Seu nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como a galera te chama?"
                required={mode === "register"}
                className="w-full card px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 bg-transparent"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full card px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              required
              minLength={4}
              className="w-full card px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 bg-transparent"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm font-semibold text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2.5"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-base py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-purple-600 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === "register" ? (
              <>
                <UserPlus className="w-5 h-5" />
                Criar conta e votar
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>
      </motion.div>

      <Link
        href="/"
        className="mt-8 text-zinc-600 text-sm hover:text-zinc-400 transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>
    </main>
  );
}

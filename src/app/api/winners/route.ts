import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getKV } from "@/lib/kv";
import { getAllUsers } from "@/lib/auth";
import { categories, getNomineeFilmId } from "@/lib/data";
import type { VoteData } from "@/app/api/votes/route";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, ...members: string[]): Promise<void>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, ...members: string[]): Promise<void>;
}

async function saveCurrentPositions(kv: KVStore) {
  try {
    const users = await getAllUsers();
    const winners = (await kv.get<Record<string, string>>("winners")) || {};

    const scores: Array<{ userId: string; score: number; lastUpdated: string }> = [];
    for (const user of users) {
      const votes = (await kv.get<VoteData>(`votes:${user.id}`)) || {};
      let willWinScore = 0;
      let wantToWinScore = 0;
      let filmBonusScore = 0;

      for (const cat of categories) {
        const vote = votes[cat.id];
        if (vote?.willWin && winners[cat.id] && vote.willWin === winners[cat.id]) {
          willWinScore += cat.points;
        }
        if (vote?.wantToWin && winners[cat.id] && vote.wantToWin === winners[cat.id]) {
          wantToWinScore += 0.5;
        }
      }

      const lastUpdated = (await kv.get<string>(`votes:${user.id}:lastUpdated`)) || user.createdAt;
      scores.push({ userId: user.id, score: willWinScore + filmBonusScore + wantToWinScore, lastUpdated });
    }

    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    });

    const positions: Record<string, number> = {};
    scores.forEach((s, i) => { positions[s.userId] = i + 1; });
    await kv.set("ranking:positions", positions);
  } catch (err) {
    console.error("Error saving positions:", err);
  }
}

export async function GET() {
  try {
    const kv = await getKV();
    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    return NextResponse.json({ winners });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar vencedores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { categoryId, nomineeId } = await request.json();
    const kv = await getKV();

    // Save current ranking positions before changing winners
    await saveCurrentPositions(kv);

    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    winners[categoryId] = nomineeId;
    await kv.set("winners", winners);

    return NextResponse.json({ success: true, winners });
  } catch {
    return NextResponse.json({ error: "Erro ao definir vencedor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { categoryId } = await request.json();
    const kv = await getKV();

    // Save current ranking positions before changing winners
    await saveCurrentPositions(kv);

    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    delete winners[categoryId];
    await kv.set("winners", winners);

    return NextResponse.json({ success: true, winners });
  } catch {
    return NextResponse.json({ error: "Erro ao remover vencedor" }, { status: 500 });
  }
}

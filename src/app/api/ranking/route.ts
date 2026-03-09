import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";
import { getKV } from "@/lib/kv";
import { categories } from "@/lib/data";
import type { VoteData } from "@/app/api/votes/route";

export const dynamic = "force-dynamic";

export interface RankingEntry {
  userId: string;
  name: string;
  willWinScore: number;
  wantToWinScore: number;
  totalCategories: number;
  willWinDetails: Record<string, { picked: string; correct: boolean | null }>;
  wantToWinDetails: Record<string, { picked: string; correct: boolean | null }>;
  lastUpdated: string;
}

export async function GET() {
  try {
    const kv = await getKV();
    const users = await getAllUsers();
    const winners = (await kv.get<Record<string, string>>("winners")) || {};

    const rankings: RankingEntry[] = [];

    for (const user of users) {
      const votes = (await kv.get<VoteData>(`votes:${user.id}`)) || {};
      const lastUpdated =
        (await kv.get<string>(`votes:${user.id}:lastUpdated`)) || user.createdAt;

      let willWinScore = 0;
      let wantToWinScore = 0;
      let totalCategories = 0;
      const willWinDetails: Record<string, { picked: string; correct: boolean | null }> = {};
      const wantToWinDetails: Record<string, { picked: string; correct: boolean | null }> = {};

      for (const cat of categories) {
        const vote = votes[cat.id];
        if (vote) {
          if (vote.willWin) {
            totalCategories++;
            const winner = winners[cat.id];
            const correct = winner ? vote.willWin === winner : null;
            if (correct) willWinScore++;
            willWinDetails[cat.id] = { picked: vote.willWin, correct };
          }
          if (vote.wantToWin) {
            const winner = winners[cat.id];
            const correct = winner ? vote.wantToWin === winner : null;
            if (correct) wantToWinScore++;
            wantToWinDetails[cat.id] = { picked: vote.wantToWin, correct };
          }
        }
      }

      rankings.push({
        userId: user.id,
        name: user.name,
        willWinScore,
        wantToWinScore,
        totalCategories,
        willWinDetails,
        wantToWinDetails,
        lastUpdated,
      });
    }

    // Sort by willWin score desc, then by earliest vote (tiebreaker)
    rankings.sort((a, b) => {
      if (b.willWinScore !== a.willWinScore) return b.willWinScore - a.willWinScore;
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    });

    const winnersCount = Object.keys(winners).length;

    return NextResponse.json({ rankings, winners, totalCategories: categories.length, winnersCount });
  } catch {
    return NextResponse.json({ error: "Erro ao calcular ranking" }, { status: 500 });
  }
}

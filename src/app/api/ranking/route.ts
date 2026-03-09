import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";
import { getKV } from "@/lib/kv";
import { categories, nominees, getNomineeFilmId, filmNamesPtBr } from "@/lib/data";
import type { VoteData } from "@/app/api/votes/route";

export const dynamic = "force-dynamic";

export interface FilmAwardCount {
  filmId: string;
  filmName: string;
  count: number;
}

export interface RankingEntry {
  userId: string;
  name: string;
  // Weighted category scores
  willWinScore: number;
  wantToWinScore: number; // 0.5 per correct
  // Film bonus
  filmBonusScore: number;
  // Consolidated
  totalScore: number;
  // Details
  totalCategories: number;
  willWinDetails: Record<string, { picked: string; correct: boolean | null; points: number }>;
  wantToWinDetails: Record<string, { picked: string; correct: boolean | null }>;
  // User's predicted top 5 most awarded films
  predictedTopFilms: FilmAwardCount[];
  filmBonusDetails: Array<{ filmId: string; filmName: string; predictedPos: number; actualPos: number | null; bonus: number }>;
  lastUpdated: string;
}

function computeFilmAwards(votes: VoteData, useWillWin: boolean): FilmAwardCount[] {
  const filmCounts: Record<string, number> = {};

  for (const cat of categories) {
    const vote = votes[cat.id];
    const pick = useWillWin ? vote?.willWin : vote?.wantToWin;
    if (!pick) continue;

    const filmId = getNomineeFilmId(cat.id, pick);
    if (filmId) {
      filmCounts[filmId] = (filmCounts[filmId] || 0) + 1;
    }
  }

  return Object.entries(filmCounts)
    .map(([filmId, count]) => ({
      filmId,
      filmName: filmNamesPtBr[filmId] || filmId,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function computeFilmBonus(
  userTopFilms: FilmAwardCount[],
  actualTopFilms: FilmAwardCount[]
): Array<{ filmId: string; filmName: string; predictedPos: number; actualPos: number | null; bonus: number }> {
  const top5User = userTopFilms.slice(0, 5);
  const top5Actual = actualTopFilms.slice(0, 5);
  const actualPositions = new Map(top5Actual.map((f, i) => [f.filmId, i]));

  return top5User.map((film, predictedPos) => {
    const actualPos = actualPositions.get(film.filmId);
    let bonus = 0;

    if (actualPos !== undefined) {
      if (actualPos === predictedPos) {
        bonus = 2; // Exact position match
      } else {
        bonus = 1; // Film in top 5 but wrong position
      }
    }

    return {
      filmId: film.filmId,
      filmName: film.filmName,
      predictedPos: predictedPos + 1,
      actualPos: actualPos !== undefined ? actualPos + 1 : null,
      bonus,
    };
  });
}

export async function GET() {
  try {
    const kv = await getKV();
    const users = await getAllUsers();
    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    const hasWinners = Object.keys(winners).length > 0;

    // Compute actual top films from winners
    const actualFilmCounts: Record<string, number> = {};
    for (const [categoryId, nomineeId] of Object.entries(winners)) {
      const filmId = getNomineeFilmId(categoryId, nomineeId);
      if (filmId) {
        actualFilmCounts[filmId] = (actualFilmCounts[filmId] || 0) + 1;
      }
    }
    const actualTopFilms: FilmAwardCount[] = Object.entries(actualFilmCounts)
      .map(([filmId, count]) => ({ filmId, filmName: filmNamesPtBr[filmId] || filmId, count }))
      .sort((a, b) => b.count - a.count);

    const rankings: RankingEntry[] = [];

    for (const user of users) {
      const votes = (await kv.get<VoteData>(`votes:${user.id}`)) || {};
      const lastUpdated = (await kv.get<string>(`votes:${user.id}:lastUpdated`)) || user.createdAt;

      let willWinScore = 0;
      let wantToWinScore = 0;
      let totalCategories = 0;
      const willWinDetails: Record<string, { picked: string; correct: boolean | null; points: number }> = {};
      const wantToWinDetails: Record<string, { picked: string; correct: boolean | null }> = {};

      for (const cat of categories) {
        const vote = votes[cat.id];
        if (vote) {
          if (vote.willWin) {
            totalCategories++;
            const winner = winners[cat.id];
            const correct = winner ? vote.willWin === winner : null;
            const points = correct ? cat.points : 0;
            if (correct) willWinScore += cat.points;
            willWinDetails[cat.id] = { picked: vote.willWin, correct, points };
          }
          if (vote.wantToWin) {
            const winner = winners[cat.id];
            const correct = winner ? vote.wantToWin === winner : null;
            if (correct) wantToWinScore += 0.5;
            wantToWinDetails[cat.id] = { picked: vote.wantToWin, correct };
          }
        }
      }

      // Compute user's predicted top films
      const predictedTopFilms = computeFilmAwards(votes, true);

      // Compute film bonus (only if there are winners)
      let filmBonusScore = 0;
      let filmBonusDetails: Array<{ filmId: string; filmName: string; predictedPos: number; actualPos: number | null; bonus: number }> = [];

      if (hasWinners) {
        filmBonusDetails = computeFilmBonus(predictedTopFilms, actualTopFilms);
        filmBonusScore = filmBonusDetails.reduce((sum, d) => sum + d.bonus, 0);
      }

      const totalScore = willWinScore + filmBonusScore + wantToWinScore;

      rankings.push({
        userId: user.id,
        name: user.name,
        willWinScore,
        wantToWinScore,
        filmBonusScore,
        totalScore,
        totalCategories,
        willWinDetails,
        wantToWinDetails,
        predictedTopFilms,
        filmBonusDetails,
        lastUpdated,
      });
    }

    // Sort by total score desc, tiebreak by earliest vote
    rankings.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    });

    const winnersCount = Object.keys(winners).length;

    return NextResponse.json({
      rankings,
      winners,
      actualTopFilms,
      totalCategories: categories.length,
      winnersCount,
      maxWillWinScore: 41, // 6*3 + 5*2 + 13*1
    });
  } catch (err) {
    console.error("Ranking error:", err);
    return NextResponse.json({ error: "Erro ao calcular ranking" }, { status: 500 });
  }
}

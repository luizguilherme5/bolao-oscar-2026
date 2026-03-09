import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getKV } from "@/lib/kv";

export interface VoteData {
  [categoryId: string]: {
    willWin?: string;
    wantToWin?: string;
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Faça login primeiro!" }, { status: 401 });
    }

    const kv = await getKV();
    const votes = await kv.get<VoteData>(`votes:${user.id}`);
    return NextResponse.json({ votes: votes || {} });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar votos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Faça login primeiro!" }, { status: 401 });
    }

    const { votes } = await request.json();
    const kv = await getKV();

    // Merge with existing votes
    const existingVotes = (await kv.get<VoteData>(`votes:${user.id}`)) || {};
    const mergedVotes = { ...existingVotes, ...votes };

    await kv.set(`votes:${user.id}`, mergedVotes);

    // Track when user last voted (for tiebreaker)
    await kv.set(`votes:${user.id}:lastUpdated`, new Date().toISOString());

    return NextResponse.json({ success: true, votes: mergedVotes });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar votos" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getKV } from "@/lib/kv";

export interface VoteData {
  [categoryId: string]: {
    willWin?: string;
    wantToWin?: string;
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Faça login primeiro!" }, { status: 401 });
    }

    const kv = await getKV();
    const votes = await kv.get<VoteData>(`votes:${session.userId}`);
    return NextResponse.json({ votes: votes || {} });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar votos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Faça login primeiro!" }, { status: 401 });
    }

    const { votes } = await request.json();
    const kv = await getKV();

    // Merge with existing votes
    const existingVotes = (await kv.get<VoteData>(`votes:${session.userId}`)) || {};
    const mergedVotes = { ...existingVotes, ...votes };

    await kv.set(`votes:${session.userId}`, mergedVotes);
    await kv.set(`votes:${session.userId}:lastUpdated`, new Date().toISOString());

    return NextResponse.json({ success: true, votes: mergedVotes });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar votos" }, { status: 500 });
  }
}

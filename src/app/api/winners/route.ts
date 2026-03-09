import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getKV } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    delete winners[categoryId];
    await kv.set("winners", winners);

    return NextResponse.json({ success: true, winners });
  } catch {
    return NextResponse.json({ error: "Erro ao remover vencedor" }, { status: 500 });
  }
}

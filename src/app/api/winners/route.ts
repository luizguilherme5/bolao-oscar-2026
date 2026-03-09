import { NextRequest, NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/auth";
import { getKV } from "@/lib/kv";

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
    const { password, categoryId, nomineeId } = await request.json();

    if (!isAdminPassword(password)) {
      return NextResponse.json({ error: "Senha incorreta!" }, { status: 403 });
    }

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
    const { password, categoryId } = await request.json();

    if (!isAdminPassword(password)) {
      return NextResponse.json({ error: "Senha incorreta!" }, { status: 403 });
    }

    const kv = await getKV();
    const winners = (await kv.get<Record<string, string>>("winners")) || {};
    delete winners[categoryId];
    await kv.set("winners", winners);

    return NextResponse.json({ success: true, winners });
  } catch {
    return NextResponse.json({ error: "Erro ao remover vencedor" }, { status: 500 });
  }
}

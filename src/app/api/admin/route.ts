import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getKV } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const kv = await getKV();
    const votingLocked = (await kv.get<boolean>("voting:locked")) || false;
    const celebration = (await kv.get<boolean>("ranking:celebration")) || false;
    return NextResponse.json({ votingLocked, celebration });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const kv = await getKV();

    if (body.votingLocked !== undefined) {
      await kv.set("voting:locked", !!body.votingLocked);
    }
    if (body.celebration !== undefined) {
      await kv.set("ranking:celebration", !!body.celebration);
    }

    const votingLocked = (await kv.get<boolean>("voting:locked")) || false;
    const celebration = (await kv.get<boolean>("ranking:celebration")) || false;
    return NextResponse.json({ success: true, votingLocked, celebration });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}

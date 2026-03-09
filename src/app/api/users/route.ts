import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, deleteUser } from "@/lib/auth";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const users = await getAllUsers();
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return NextResponse.json({ users: safeUsers });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    const result = await deleteUser(userId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const users = await getAllUsers();
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return NextResponse.json({ success: true, users: safeUsers });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}

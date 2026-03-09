import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser, createSession, getCurrentUser, destroySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, action } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios!" }, { status: 400 });
    }

    if (action === "register") {
      if (!name) {
        return NextResponse.json({ error: "Nome é obrigatório!" }, { status: 400 });
      }

      const { user, error } = await registerUser(name, email, password);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      await createSession(user.id);
      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    // Login
    const { user, error } = await loginUser(email, password);
    if (error || !user) {
      return NextResponse.json({ error: error || "Erro ao fazer login" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao sair" }, { status: 500 });
  }
}

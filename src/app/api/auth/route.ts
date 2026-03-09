import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser } from "@/lib/auth";
import { getSession } from "@/lib/session";

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
      if (error || !user) {
        return NextResponse.json({ error }, { status: 400 });
      }

      const session = await getSession();
      session.userId = user.id;
      session.userName = user.name;
      session.userEmail = user.email;
      session.isAdmin = user.isAdmin;
      session.isLoggedIn = true;
      await session.save();

      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    }

    // Login
    const { user, error } = await loginUser(email, password);
    if (error || !user) {
      return NextResponse.json({ error: error || "Erro ao fazer login" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.userName = user.name;
    session.userEmail = user.email;
    session.isAdmin = user.isAdmin;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.userName,
        email: session.userEmail,
        isAdmin: session.isAdmin || false,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao sair" }, { status: 500 });
  }
}

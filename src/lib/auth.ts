import { cookies } from "next/headers";
import { getKV } from "./kv";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const ADMIN_PASSWORD = "WagnerMoura123";

export async function registerUser(name: string, email: string, password: string): Promise<{ user: User; error?: string }> {
  const kv = await getKV();
  const normalizedEmail = email.toLowerCase().trim();

  const existingUserId = await kv.get<string>(`user:email:${normalizedEmail}`);
  if (existingUserId) {
    return { user: null as unknown as User, error: "Email já cadastrado. Faça login!" };
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`user:${id}`, user);
  await kv.set(`user:email:${normalizedEmail}`, id);
  await kv.sadd("users:list", id);

  return { user };
}

export async function loginUser(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const kv = await getKV();
  const normalizedEmail = email.toLowerCase().trim();

  const userId = await kv.get<string>(`user:email:${normalizedEmail}`);
  if (!userId) {
    return { user: null, error: "Email não encontrado. Cadastre-se!" };
  }

  const user = await kv.get<User>(`user:${userId}`);
  if (!user) {
    return { user: null, error: "Erro interno. Tente novamente." };
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return { user: null, error: "Senha incorreta!" };
  }

  return { user };
}

export async function createSession(userId: string): Promise<string> {
  const kv = await getKV();
  const sessionToken = uuidv4();
  await kv.set(`session:${sessionToken}`, userId);

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return sessionToken;
}

export async function getCurrentUser(): Promise<User | null> {
  const kv = await getKV();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const userId = await kv.get<string>(`session:${sessionToken}`);
  if (!userId) return null;

  const user = await kv.get<User>(`user:${userId}`);
  return user;
}

export async function destroySession(): Promise<void> {
  const kv = await getKV();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    await kv.del(`session:${sessionToken}`);
    cookieStore.delete("session");
  }
}

export function isAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function getAllUsers(): Promise<User[]> {
  const kv = await getKV();
  const userIds = await kv.smembers("users:list");
  const users: User[] = [];

  for (const id of userIds) {
    const user = await kv.get<User>(`user:${id}`);
    if (user) users.push(user);
  }

  return users;
}

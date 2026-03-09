import { getKV } from "./kv";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plain text for now (TODO: hash in production)
  createdAt: string;
}

const ADMIN_PASSWORD = "WagnerMoura123";

export async function registerUser(name: string, email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const kv = await getKV();
  const normalizedEmail = email.toLowerCase().trim();

  const existingUserId = await kv.get<string>(`user:email:${normalizedEmail}`);
  if (existingUserId) {
    return { user: null, error: "Email já cadastrado. Faça login!" };
  }

  const id = uuidv4();
  const user: User = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    password,
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

  if (user.password !== password) {
    return { user: null, error: "Senha incorreta!" };
  }

  return { user };
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

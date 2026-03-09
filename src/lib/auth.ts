import { getKV } from "./kv";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

const ADMIN_EMAIL = "luizonbits@gmail.com";

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
    isAdmin: normalizedEmail === ADMIN_EMAIL,
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

  // Ensure admin flag is current
  if (normalizedEmail === ADMIN_EMAIL && !user.isAdmin) {
    user.isAdmin = true;
    await kv.set(`user:${userId}`, user);
  }

  return { user };
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

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const kv = await getKV();

  const user = await kv.get<User>(`user:${userId}`);
  if (!user) {
    return { success: false, error: "Usuário não encontrado." };
  }

  if (user.isAdmin) {
    return { success: false, error: "Não é possível deletar um administrador." };
  }

  await kv.del(`user:${userId}`);
  await kv.del(`user:email:${user.email}`);
  await kv.srem("users:list", userId);
  await kv.del(`votes:${userId}`);

  return { success: true };
}

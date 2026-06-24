import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { AppError } from "../middleware/error-handler";
import type { JwtPayload } from "../types";

interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

async function getUserRole(userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", userId)
    .limit(1)
    .single();

  return (data as any)?.roles?.code ?? "buyer";
}

export async function register(input: RegisterInput) {
  const { email, password, fullName, phone } = input;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    throw new AppError(409, "EMAIL_EXISTS", "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone, password_hash: passwordHash },
  });

  if (authError || !authUser.user) {
    throw new AppError(500, "REGISTRATION_FAILED", authError?.message ?? "Failed to create account");
  }

  const userId = authUser.user.id;
  const role = await getUserRole(userId);

  const payload: JwtPayload = { userId, email, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { accessToken, refreshToken, user: { id: userId, email, fullName, role } };
}

export async function login(input: LoginInput) {
  const { email, password } = input;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, status")
    .eq("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  if (!profile) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  if (profile.status !== "active") {
    throw new AppError(403, "ACCOUNT_SUSPENDED", "Your account has been suspended");
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const role = await getUserRole(profile.id);

  const payload: JwtPayload = { userId: profile.id, email, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: { id: profile.id, email, fullName: profile.full_name, role },
  };
}

export async function getMe(userId: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, status")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError(500, "DB_ERROR", error.message);
  }

  if (!profile) {
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    if (!authUser?.user) {
      throw new AppError(404, "USER_NOT_FOUND", "User profile not found");
    }

    const role = await getUserRole(userId);
    return {
      id: userId,
      email: authUser.user.email ?? "",
      fullName: authUser.user.user_metadata?.full_name ?? "HMART User",
      phone: authUser.user.phone ?? null,
      status: "active",
      role,
    };
  }

  const role = await getUserRole(userId);

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    phone: profile.phone,
    status: profile.status,
    role,
  };
}

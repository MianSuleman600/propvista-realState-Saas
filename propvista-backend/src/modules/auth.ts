// D:\MERN\propvista\propvista-backend\src\modules\auth.ts
import jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { prisma } from "../prisma/client.js";
import "dotenv/config";
import type { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

const EXPIRES_IN: NonNullable<SignOptions["expiresIn"]> =
  (process.env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "1d";

export async function signup(email: string, username: string, password: string) {
  try {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (exists) {
      throw new Error("User with this email or username already exists.");
    }

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashed }
    });

    // Sign token with extra claims (id, username, email, avatar, role)
    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? null,
        role: user.role ?? "user",
      },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN } as SignOptions
    );

    return { token, user };
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function login(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) throw new Error("User not found.");

    const ok = await compare(password, user.password);
    if (!ok) throw new Error("Invalid password.");

    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? null,
        role: user.role ?? "user",
      },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN } as SignOptions
    );

    return { token, user };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

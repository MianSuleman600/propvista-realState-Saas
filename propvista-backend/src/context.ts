// propvista-backend/src/context.ts
import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import jwt from "jsonwebtoken";
import { prisma } from "../src/prisma/client.js";
import type { Response } from "express";

type UserToken = { sub: string; role: string } | null;

export type GraphQLContext = {
  prisma: typeof prisma;
  user: UserToken;
  res: Response;
};

export function buildContext({ req, res }: ExpressContextFunctionArgument): GraphQLContext {
  let user: UserToken = null;
  const token = req.cookies?.accessToken; // <-- Correct cookie name

  if (token && process.env.JWT_SECRET) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET) as any;
    } catch {
      user = null;
    }
  }

  return { prisma, user, res };
}

export function requireAdmin(ctx: GraphQLContext) {
  if (!ctx.user || ctx.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
}

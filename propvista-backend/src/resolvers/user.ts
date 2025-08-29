// src/resolvers/user.ts
import { signup, login } from "../modules/auth.js";
import type { GraphQLContext } from "../context.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",           // Prod میں true ہونا چاہیے
  sameSite: process.env.NODE_ENV === "production" ? "none" as "none" : "lax" as "lax", // Dev میں lax، Prod میں none
  maxAge: 1000 * 60 * 60 * 24, // 1 دن (ms میں)
};

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, ctx: GraphQLContext) => {
      if (!ctx.user) return null;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.sub },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log("me query userId:", user?.id); // Token مت لاگ کرو

      return user;
    },
  },

  Mutation: {
    signup: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const { token, user } = await signup(input.email, input.username, input.password);

      console.log("signup userId:", user.id);

      ctx.res.cookie("accessToken", token, cookieOptions);

      // Token body میں واپس نہیں بھیجیں گے (زیادہ محفوظ)
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    login: async (_: any, { input }: any, ctx: GraphQLContext) => {
      const { token, user } = await login(input.username, input.password);

      console.log("login userId:", user.id);

      ctx.res.cookie("accessToken", token, cookieOptions);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    logout: async (_: any, __: any, ctx: GraphQLContext) => {
      ctx.res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      console.log("logout mutation called");

      return { success: true };
    },
  },
};

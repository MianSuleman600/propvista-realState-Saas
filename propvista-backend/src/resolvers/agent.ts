import type { GraphQLContext } from "../context.js";
import { requireAdmin } from "../context.js";

export const agentResolvers = {
  Query: {
    agents: async (_: any, { q, page = 1, pageSize = 20 }: any, ctx: GraphQLContext) => {
      const where = q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {};
      const agents = await ctx.prisma.agent.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: "asc" },
      });
      return agents;
    },
    agent: (_: any, { id }: any, ctx: GraphQLContext) =>
      ctx.prisma.agent.findUnique({ where: { id } }),
  },
  Agent: {
    properties: (parent: any, _: any, ctx: GraphQLContext) =>
      ctx.prisma.property.findMany({ where: { agentId: parent.id }, orderBy: { createdAt: "desc" } }),
  },
  Mutation: {
    createAgent: async (_: any, { input }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.agent.create({ data: input });
    },
    updateAgent: async (_: any, { id, input }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.agent.update({ where: { id }, data: input });
    },
    deleteAgent: async (_: any, { id }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await ctx.prisma.agent.delete({ where: { id } });
      return true;
    },
  },
};

import slugify from "@sindresorhus/slugify";
import type { GraphQLContext } from "../context.js";
import { requireAdmin } from "../context.js";

function parseOrderBy(orderBy: string) {
  const field = orderBy.replace(/^-/, "");
  const direction = orderBy.startsWith("-") ? "desc" : "asc";
  return { [field]: direction } as any;
}

export const propertyResolvers = {
  Query: {
    property: async (_: any, { id, slug }: any, ctx: GraphQLContext) => {
      if (id) return ctx.prisma.property.findUnique({ where: { id }, include: { agent: true } });
      if (slug) return ctx.prisma.property.findUnique({ where: { slug }, include: { agent: true } });
      return null;
    },

    properties: async (_: any, { page = 1, pageSize = 12, orderBy = "-createdAt", filter }: any, ctx: GraphQLContext) => {
      const where: any = {};
      if (filter?.q) {
        where.OR = [
          { title: { contains: filter.q, mode: "insensitive" } },
          { description: { contains: filter.q, mode: "insensitive" } },
          { location: { contains: filter.q, mode: "insensitive" } },
        ];
      }
      if (filter?.location) where.location = { contains: filter.location, mode: "insensitive" };
      if (filter?.propertyType) where.propertyType = filter.propertyType;
      if (filter?.status) where.status = filter.status;
      if (filter?.minPrice) where.price = { ...(where.price || {}), gte: filter.minPrice };
      if (filter?.maxPrice) where.price = { ...(where.price || {}), lte: filter.maxPrice };
      if (filter?.minBedrooms) where.bedrooms = { gte: filter.minBedrooms };
      if (filter?.minBathrooms) where.bathrooms = { gte: filter.minBathrooms };

      const total = await ctx.prisma.property.count({ where });
      const nodes = await ctx.prisma.property.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: parseOrderBy(orderBy),
        include: { agent: true },
      });

      return {
        nodes,
        pageInfo: {
          total,
          page,
          pageSize,
          hasNextPage: page * pageSize < total,
        },
      };
    },
  },

  Property: {
    agent: (parent: any, _args: any, ctx: GraphQLContext) =>
      parent.agent ?? ctx.prisma.agent.findUnique({ where: { id: parent.agentId || "" } }),
  },

  Mutation: {
    createProperty: async (_: any, { input }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      const slug = slugify(input.title, { lowercase: true });
      return ctx.prisma.property.create({ data: { ...input, slug } });
    },
    updateProperty: async (_: any, { id, input }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      const data: any = { ...input };
      if (input.title) data.slug = slugify(input.title, { lowercase: true });
      return ctx.prisma.property.update({ where: { id }, data });
    },
    deleteProperty: async (_: any, { id }: any, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await ctx.prisma.property.delete({ where: { id } });
      return true;
    },
  },
};

import type { GraphQLContext } from "../context.js";

export const inquiryResolvers = {
  Mutation: {
    createInquiry: async (_: any, { input }: any, ctx: GraphQLContext) => {
      return ctx.prisma.inquiry.create({ data: input });
    },
  },
};

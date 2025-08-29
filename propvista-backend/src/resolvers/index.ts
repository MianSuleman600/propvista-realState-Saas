import { GraphQLScalarType, Kind } from "graphql";
import { userResolvers } from "./user.js";
import { agentResolvers } from "./agent.js";
import { propertyResolvers } from "./property.js";
import { inquiryResolvers } from "./inquiry.js";

const dateScalar = new GraphQLScalarType({
  name: "DateTime",
  serialize: (v: any) => (v instanceof Date ? v.toISOString() : v),
  parseValue: (v: any) => new Date(v),
  parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null),
});

export const resolvers = [
  { DateTime: dateScalar },
  userResolvers,
  agentResolvers,
  propertyResolvers,
  inquiryResolvers,
];

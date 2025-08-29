import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { readFileSync } from "fs";
import path from "path";
import { buildContext } from "./context.js";
import type { GraphQLContext } from "./context.js";
import { resolvers } from "./resolvers/index.js";
import { fileURLToPath } from 'url';

// Get the directory name for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  // Apply global middlewares. Note that CORS is NOT applied globally.
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use("/graphql", rateLimit({ windowMs: 60_000, max: 120 }));

  // Declare ApolloServer with GraphQLContext type
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV !== "production",
  });

  await server.start();

  // Configure CORS and expressMiddleware in a single call.
  // This is the most reliable way to handle CORS for Apollo Server Express Integration.
  // This will ensure that the correct headers are set for the GraphQL endpoint.
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000"], // Use an array for a single origin
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async (args) => buildContext(args),
    })
  );

  app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

  const port = Number(process.env.PORT || 4000);
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });

  process.on("SIGTERM", () => httpServer.close());
  process.on("SIGINT", () => httpServer.close());
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
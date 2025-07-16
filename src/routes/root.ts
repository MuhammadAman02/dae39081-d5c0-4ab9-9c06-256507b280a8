import { FastifyPluginAsync } from "fastify";
import { db } from "../db/client";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/", async function (request, reply) {
    return { message: "Welcome to the Furniture Store API!" };
  });

  fastify.get("/health", async function (request, reply) {
    try {
      // Test database connection
      await db.execute('SELECT 1');
      return { 
        status: "OK", 
        message: "Furniture Store API is running",
        database: "Connected"
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return reply.status(500).send({
        status: "ERROR",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default root;
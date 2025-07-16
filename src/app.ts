import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import helmet from "@fastify/helmet";
import root from "./routes/root";
import { userRoutes } from "./routes/user.route";
import { categoryRoutes } from "./routes/category.route";
import { productRoutes } from "./routes/product.route";
import { cartRoutes } from "./routes/cart.route";
import { orderRoutes } from "./routes/order.route";

export async function createApp() {
  const app = Fastify({
    logger: true,
  });
  
  await app.register(fastifySwagger, {
      swagger: {
        info: {
          title: "Furniture Store API",
          description: "Complete ecommerce API for furniture store with user management, products, cart, and orders",
          version: "1.0.0",
        },
        securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter: Bearer {token}',
          },
        },
      },
    });

  await app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
      staticCSP: false,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
    
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["*"],
      },
    },
  });

  // Register routes
  app.register(root, { prefix: "/" });
  app.register(userRoutes);
  app.register(categoryRoutes);
  app.register(productRoutes);
  app.register(cartRoutes);
  app.register(orderRoutes);

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation failed",
        details: error.validation,
      });
    }
    
    reply.status(500).send({ error: "Internal Server Error" });
  });

  return app;
}
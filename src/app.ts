import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { usersRoute } from "./routes/users.route";
import { connectToDatabase } from "./services/mongodb/connection";
import { FastifyTypedInstance } from "./types/fastify-typed-instance";

export class App {
  server: FastifyTypedInstance;

  constructor(server: FastifyTypedInstance) {
    this.server = server;
  }

  registerRoutes() {
    usersRoute(this.server);
    return this;
  }

  setupTypeProviderZod() {
    this.server.withTypeProvider<ZodTypeProvider>();
    this.server.setSerializerCompiler(serializerCompiler);
    this.server.setValidatorCompiler(validatorCompiler);
    return this;
  }

  setupApp() {
    this.setupTypeProviderZod();
    this.registerRoutes();
    return this;
  }

  async start() {
    try {
      await connectToDatabase();

      this.server.listen(
        {
          port: env.PORT,
          host: env.HOST,
        },
        (err, address) => {
          if (err) console.error(err);
          else console.log(`Server listening at ${address}`);
        }
      );
      return this;
    } catch (err) {
      console.error("Error starting server:", err);
    }
  }
}

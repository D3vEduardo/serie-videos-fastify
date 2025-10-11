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
    } catch (err) {
      console.error("Error starting server:", err);
    }
  }
}

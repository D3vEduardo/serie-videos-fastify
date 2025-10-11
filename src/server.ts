import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { App } from "./app";

const server = fastify();

server.withTypeProvider<ZodTypeProvider>();
server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.get("/", async (_request, response) => {
  return response.send("Hello World!");
});

const app = new App(server);

app.registerRoutes();

app.start();

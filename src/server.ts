import { fastify } from "fastify";
import { App } from "./app";

const app = new App(fastify()).setupApp();

app.server.get("/", async (_request, response) => {
  return response.send("Hello World!");
});

app.start();

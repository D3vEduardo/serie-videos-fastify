import { fastify } from "fastify";
import { App } from "./app";

const app = new App(fastify()).setupApp();

app.server.addHook("onRequest", async () => {
  console.log("Global Scope Start:", new Date().toISOString());
  console.log("- Global Scope");
});

app.server.get("/", async (_request, response) => {
  return response.send("Hello World!");
});

app.start();

import { fastify } from "fastify";
import { env } from "./env";

const server = fastify();

server.get("/", async (_request, response) => {
  return response.send("Hello World!");
});

server.listen(
  {
    port: env.PORT,
    host: env.HOST,
  },
  (err, address) => {
    if (err) console.error(err);
    else console.log(`Server listening at ${address}`);
  }
);

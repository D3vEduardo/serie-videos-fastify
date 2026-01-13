"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const app_1 = require("./app");
const app = new app_1.App((0, fastify_1.fastify)()).setupApp();
app.server.addHook("onRequest", async () => {
    console.log("Global Scope Start:", new Date().toISOString());
    console.log("- Global Scope");
});
app.server.get("/", async (_request, response) => {
    return response.send("Hello World!");
});
app.start();

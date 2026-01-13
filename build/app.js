"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const env_1 = require("./env");
const users_route_1 = require("./routes/users.route");
const connection_1 = require("./services/mongodb/connection");
class App {
    server;
    constructor(server) {
        this.server = server;
    }
    registerRoutes() {
        // usersRoute(this.server);
        this.server.register(users_route_1.usersRoute);
        return this;
    }
    setupTypeProviderZod() {
        this.server.withTypeProvider();
        this.server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
        this.server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
        return this;
    }
    setupApp() {
        this.setupTypeProviderZod();
        this.registerRoutes();
        return this;
    }
    async start() {
        try {
            await (0, connection_1.connectToDatabase)();
            this.server.listen({
                port: env_1.env.PORT,
                host: env_1.env.HOST,
            }, (err, address) => {
                if (err)
                    console.error(err);
                else
                    console.log(`Server listening at ${address}`);
            });
            return this;
        }
        catch (err) {
            console.error("Error starting server:", err);
        }
    }
}
exports.App = App;

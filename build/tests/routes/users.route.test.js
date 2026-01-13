"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const app_1 = require("../../app");
const poku_1 = require("poku");
const user_model_1 = require("../../models/user/user.model");
const mockUser = {
    name: "João",
    age: 25,
    email: "joao@email.example",
    id: "408983636666538304141677",
};
function setupTestApp() {
    return new app_1.App((0, fastify_1.default)()).setupApp();
}
function mockAsync(method, implementation) {
    const model = user_model_1.UserModel;
    const original = model[method];
    model[method] = async (...args) => implementation(...args);
    return () => {
        model[method] = original;
    };
}
(0, poku_1.describe)("Users Route Test", async () => {
    await (0, poku_1.it)("GET /users - Pega todos os usuários", async () => {
        const restore = mockAsync("find", () => [mockUser]);
        const app = setupTestApp();
        try {
            const res = await app.server.inject({
                method: "GET",
                url: "/users",
            });
            const body = res.json();
            poku_1.assert.strictEqual(res.statusCode, 200);
            poku_1.assert.strictEqual(body.data.length, 1);
            poku_1.assert.strictEqual(body.data[0].name, mockUser.name);
        }
        finally {
            restore();
            await app.server.close();
        }
    });
    await (0, poku_1.it)("POST /users - Cria um novo usuário", async () => {
        const restore = mockAsync("create", (data) => ({
            ...data,
            id: mockUser.id,
        }));
        const app = setupTestApp();
        try {
            const res = await app.server.inject({
                method: "POST",
                url: "/users",
                payload: mockUser,
            });
            const body = res.json();
            poku_1.assert.strictEqual(res.statusCode, 201);
            poku_1.assert.strictEqual(body.data.name, mockUser.name);
        }
        finally {
            restore();
            await app.server.close();
        }
    });
    await (0, poku_1.it)("PUT /users/:id - Atualiza completamente um usuário", async () => {
        const restore = mockAsync("findByIdAndUpdate", (_, data) => ({
            ...data,
        }));
        const app = setupTestApp();
        try {
            const res = await app.server.inject({
                method: "PUT",
                url: `/users/${mockUser.id}`,
                payload: {
                    name: "João Atualizado",
                    age: 26,
                    email: "joao2@example.email",
                },
            });
            const body = res.json();
            poku_1.assert.strictEqual(res.statusCode, 200);
            poku_1.assert.strictEqual(body.data.name, "João Atualizado");
        }
        finally {
            restore();
            await app.server.close();
        }
    });
    await (0, poku_1.it)("PATCH /users/:id - Atualiza parcialmente um usuário", async () => {
        const restore = mockAsync("findByIdAndUpdate", (_, data) => ({
            ...mockUser,
            ...data,
        }));
        const app = setupTestApp();
        try {
            const res = await app.server.inject({
                method: "PATCH",
                url: `/users/${mockUser.id}`,
                payload: {
                    age: 30,
                },
            });
            const body = res.json();
            poku_1.assert.strictEqual(res.statusCode, 200);
            poku_1.assert.strictEqual(body.data.age, 30);
        }
        finally {
            restore();
            await app.server.close();
        }
    });
    await (0, poku_1.it)("DELETE /users/:id - Deleta um usuário", async () => {
        const restore = mockAsync("findByIdAndDelete", () => mockUser);
        const app = setupTestApp();
        try {
            const res = await app.server.inject({
                method: "DELETE",
                url: `/users/${mockUser.id}`,
            });
            poku_1.assert.strictEqual(res.statusCode, 200);
        }
        finally {
            restore();
            await app.server.close();
        }
    });
});

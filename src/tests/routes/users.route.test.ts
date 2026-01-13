import fastify from "fastify";
import { UserModelType } from "../../models/user/user.type";
import { App } from "../../app";
import { assert, describe, it } from "poku";
import { UserModel } from "../../models/user/user.model";
import { mock } from "node:test";
const mockUser: UserModelType = {
  name: "João",
  age: 25,
  email: "joao@email.example",
  id: "408983636666538304141677",
};

function setupTestApp() {
  return new App(fastify()).setupApp();
}

function mockAsync<T extends keyof typeof UserModel>(
  method: T,
  implementation: (...args: any[]) => unknown
) {
  const model = UserModel as Record<string, any>;
  const original = model[method as string];

  model[method as string] = async (...args: any[]) => implementation(...args);

  return () => {
    model[method as string] = original;
  };
}

describe("Users Route Test", async () => {
  await it("GET /users - Pega todos os usuários", async () => {
    const restore = mockAsync("find", () => [mockUser]);
    const app = setupTestApp();

    try {
      const res = await app.server.inject({
        method: "GET",
        url: "/users",
      });
      const body = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(body.data.length, 1);
      assert.strictEqual(body.data[0].name, mockUser.name);
    } finally {
      restore();
      await app.server.close();
    }
  });

  await it("POST /users - Cria um novo usuário", async () => {
    const restore = mockAsync("create", (data: UserModelType) => ({
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

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(body.data.name, mockUser.name);
    } finally {
      restore();
      await app.server.close();
    }
  });

  await it("PUT /users/:id - Atualiza completamente um usuário", async () => {
    const restore = mockAsync(
      "findByIdAndUpdate",
      (_, data: UserModelType) => ({
        ...data,
      })
    );
    const app = setupTestApp();

    try {
      const res = await app.server.inject({
        method: "PUT",
        url: `/users/${mockUser.id}`,
        payload: {
          name: "João Atualizado",
          age: 26,
          email: "joao2@example.email",
        } as UserModelType,
      });

      const body = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(body.data.name, "João Atualizado");
    } finally {
      restore();
      await app.server.close();
    }
  });

  await it("PATCH /users/:id - Atualiza parcialmente um usuário", async () => {
    const restore = mockAsync(
      "findByIdAndUpdate",
      (_, data: Partial<UserModelType>) => ({
        ...mockUser,
        ...data,
      })
    );
    const app = setupTestApp();

    try {
      const res = await app.server.inject({
        method: "PATCH",
        url: `/users/${mockUser.id}`,
        payload: {
          age: 30,
        } as UserModelType,
      });

      const body = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(body.data.age, 30);
    } finally {
      restore();
      await app.server.close();
    }
  });

  await it("DELETE /users/:id - Deleta um usuário", async () => {
    const restore = mockAsync("findByIdAndDelete", () => mockUser);
    const app = setupTestApp();

    try {
      const res = await app.server.inject({
        method: "DELETE",
        url: `/users/${mockUser.id}`,
      });

      assert.strictEqual(res.statusCode, 200);
    } finally {
      restore();
      await app.server.close();
    }
  });
});

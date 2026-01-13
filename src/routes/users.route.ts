import { z } from "zod";
import { FastifyTypedInstance } from "../types/fastify-typed-instance";
import { userSchema } from "../models/user/user.type";
import { UserModel } from "../models/user/user.model";

export function usersRoute(server: FastifyTypedInstance) {
  server.addHook("onRequest", async () => {
    console.log("Route Scope Request Start:", new Date().toISOString());
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("- Route Scope");
    console.log("Route Scope Request End:", new Date().toISOString());
  });

  server.get(
    "/users",
    {
      schema: {
        summary: "Get all users",
        tags: ["Users"],
        description: "Retrieve a list of all users",
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(userSchema),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_req, reply) => {
      try {
        const users = await UserModel.find();

        return reply
          .status(200)
          .send({ message: "Users fetched", data: users });
      } catch (err) {
        console.error("Error fetching users:", err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  server.post(
    "/users",
    {
      schema: {
        summary: "Create a new user",
        tags: ["Users"],
        description: "Create a new user with the provided data",
        body: userSchema.strict(),
        response: {
          201: z.object({
            message: z.string(),
            data: userSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const newUser = await UserModel.create(req.body);

        return reply
          .status(201)
          .send({ message: "User created", data: newUser });
      } catch (err) {
        console.error("Error creating user:", err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  server.put(
    "/users/:id",
    {
      schema: {
        summary: "Update a user",
        tags: ["Users"],
        description: "Update an existing user by ID with the provided data",
        params: z.object({
          id: z.string().length(24),
        }),
        body: userSchema.strict(),
        response: {
          200: z.object({
            message: z.string(),
            data: userSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedUser) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply
          .status(200)
          .send({ message: "User updated", data: updatedUser });
      } catch (err) {
        console.error("Error updating user:", err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  server.patch(
    "/users/:id",
    {
      schema: {
        summary: "Partially update a user",
        tags: ["Users"],
        description:
          "Partially update an existing user by ID with the provided data",
        params: z.object({
          id: z.string().length(24),
        }),
        body: userSchema.partial(),
        response: {
          200: z.object({
            message: z.string(),
            data: userSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedUser) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply
          .status(200)
          .send({ message: "User partially updated", data: updatedUser });
      } catch (err) {
        console.error("Error partially updating user:", err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  server.delete(
    "/users/:id",
    {
      schema: {
        summary: "Delete a user",
        tags: ["Users"],
        description: "Delete an existing user by ID",
        params: z.object({
          id: z.string().length(24),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send({ message: "User deleted" });
      } catch (err) {
        console.error("Error deleting user:", err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}

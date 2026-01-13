"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoute = usersRoute;
const zod_1 = require("zod");
const user_type_1 = require("../models/user/user.type");
const user_model_1 = require("../models/user/user.model");
function usersRoute(server) {
    server.addHook("onRequest", async () => {
        console.log("Route Scope Request Start:", new Date().toISOString());
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("- Route Scope");
        console.log("Route Scope Request End:", new Date().toISOString());
    });
    server.get("/users", {
        schema: {
            summary: "Get all users",
            tags: ["Users"],
            description: "Retrieve a list of all users",
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                    data: zod_1.z.array(user_type_1.userSchema),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (_req, reply) => {
        try {
            const users = await user_model_1.UserModel.find();
            return reply
                .status(200)
                .send({ message: "Users fetched", data: users });
        }
        catch (err) {
            console.error("Error fetching users:", err);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
    server.post("/users", {
        schema: {
            summary: "Create a new user",
            tags: ["Users"],
            description: "Create a new user with the provided data",
            body: user_type_1.userSchema.strict(),
            response: {
                201: zod_1.z.object({
                    message: zod_1.z.string(),
                    data: user_type_1.userSchema,
                }),
                400: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (req, reply) => {
        try {
            const newUser = await user_model_1.UserModel.create(req.body);
            return reply
                .status(201)
                .send({ message: "User created", data: newUser });
        }
        catch (err) {
            console.error("Error creating user:", err);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
    server.put("/users/:id", {
        schema: {
            summary: "Update a user",
            tags: ["Users"],
            description: "Update an existing user by ID with the provided data",
            params: zod_1.z.object({
                id: zod_1.z.string().length(24),
            }),
            body: user_type_1.userSchema.strict(),
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                    data: user_type_1.userSchema,
                }),
                400: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                404: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (req, reply) => {
        try {
            const { id } = req.params;
            const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!updatedUser) {
                return reply.status(404).send({ message: "User not found" });
            }
            return reply
                .status(200)
                .send({ message: "User updated", data: updatedUser });
        }
        catch (err) {
            console.error("Error updating user:", err);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
    server.patch("/users/:id", {
        schema: {
            summary: "Partially update a user",
            tags: ["Users"],
            description: "Partially update an existing user by ID with the provided data",
            params: zod_1.z.object({
                id: zod_1.z.string().length(24),
            }),
            body: user_type_1.userSchema.partial(),
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                    data: user_type_1.userSchema,
                }),
                400: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                404: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (req, reply) => {
        try {
            const { id } = req.params;
            const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!updatedUser) {
                return reply.status(404).send({ message: "User not found" });
            }
            return reply
                .status(200)
                .send({ message: "User partially updated", data: updatedUser });
        }
        catch (err) {
            console.error("Error partially updating user:", err);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
    server.delete("/users/:id", {
        schema: {
            summary: "Delete a user",
            tags: ["Users"],
            description: "Delete an existing user by ID",
            params: zod_1.z.object({
                id: zod_1.z.string().length(24),
            }),
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                404: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
                500: zod_1.z.object({
                    message: zod_1.z.string(),
                }),
            },
        },
    }, async (req, reply) => {
        try {
            const { id } = req.params;
            const deletedUser = await user_model_1.UserModel.findByIdAndDelete(id);
            if (!deletedUser) {
                return reply.status(404).send({ message: "User not found" });
            }
            return reply.status(200).send({ message: "User deleted" });
        }
        catch (err) {
            console.error("Error deleting user:", err);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
}

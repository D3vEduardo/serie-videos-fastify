"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../../env");
const path_1 = __importDefault(require("path"));
async function connectToDatabase() {
    const certificatePath = path_1.default.resolve(".certs/certificate.pem");
    console.log("Connecting to database with certificate:", certificatePath);
    await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
        dbName: "main",
        tls: true,
        tlsCAFile: certificatePath,
        tlsCertificateKeyFile: certificatePath,
    });
    console.log("Connected to database:", mongoose_1.default.connection.name);
}

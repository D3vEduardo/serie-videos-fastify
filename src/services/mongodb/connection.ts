import mongoose from "mongoose";
import { env } from "../../env";
import path from "path";

export async function connectToDatabase() {
  const certificatePath = path.resolve(".certs/certificate.pem");

  console.log("Connecting to database with certificate:", certificatePath);

  await mongoose.connect(env.MONGODB_URI, {
    dbName: "main",
    tls: true,
    tlsCAFile: certificatePath,
    tlsCertificateKeyFile: certificatePath,
  });

  console.log("Connected to database:", mongoose.connection.name);
}

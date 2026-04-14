// /lib/db.ts
import mongoose, { ConnectOptions, Connection } from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

const options: ConnectOptions = {
  bufferCommands: false, // fail fast if not connected
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(uri, options)
      .then((mongoose) => mongoose.connection);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
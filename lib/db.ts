// /lib/db.ts
import mongoose, { ConnectOptions, Connection } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  } | undefined;
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

// TypeScript knows `uri` is definitely a string
const uri: string = MONGO_URI;

const options: ConnectOptions = {
  bufferCommands: false, // fail fast if not connected
};

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(uri, options).then((mongoose) => mongoose.connection);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
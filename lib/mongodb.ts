// /lib/mongodb.ts
import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    var mongooseGlobal: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseGlobal ?? (global.mongooseGlobal = { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined")
    }
    if (cached.conn) {
        return cached?.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    }

    const connection = await cached.promise;
    cached.conn = connection;
    return connection;
}
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
    throw new Error("Please define MONGODB_URL in environment variables.");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

export async function connectionToDB() {
    // 1. Already connected?
    if (cached.conn) {
        return cached.conn;
    }

    // 2. Connection not started yet?
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };

        cached.promise = mongoose
            .connect(MONGODB_URL, opts)
            .then((mongoose) => mongoose.connection);
    }

    // 3. Wait for connection
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
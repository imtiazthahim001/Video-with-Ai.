// types.d.ts : The purpose is to tell TypeScript about a global variable called mongoose that you're going to use to cache your MongoDB connection in Next.js.


import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
}

export {}
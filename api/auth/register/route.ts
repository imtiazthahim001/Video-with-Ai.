import { connectionToDB } from "@/lib/db";
import User from "@/models/User";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

// Register user Post Route
export async function POST(request: NextRequest){
    try {

        // take crendentails (Get Data from Frontend : usally in JSON formate)
        const {email, password} =await request.json();

        // validate
        if(!email || !password){
            return NextResponse.json(
                {
                    error : "email & password are required."
                },
                {
                    status: 400
                }
            )
        }

        // check for DB connection (Edge connection/ Connection state sharing)
        await connectionToDB()

        // check existing
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return NextResponse.json(
                {
                    error : "User already registered."
                },
                {
                    status: 400
                }
            );
        }

        // create user 
        await User.create({
            email,
            password
        });

        // return success response
        return NextResponse.json(
            {
               message : "User registered successfully." 
            },
            {
                status: 200
            }
        );
    } catch (error) {

        console.log("Regsiteration Error : ",error);

        return NextResponse.json(
            {
                error : "Failed to register user."
            },
            {
                status : 400
            }
        );

    }
}
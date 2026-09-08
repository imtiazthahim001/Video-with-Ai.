import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectionToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
    CredentialsProvider({
        name : "Credentials",
        credentials: { 
            email :{label : "Email", type: "text" },
            password : { label : "Password", type: "text"}
        },
        async authorize(credentials, req) {

            if( !credentials?.email || !credentials?.password ){
                throw new Error("Credentials are required.");
            }

            try {
                // check db connection
                await connectionToDB();
                // check user in db
                const user = await User.findOne({email : credentials.email});
                if(!user){
                    throw new Error("User not found, check your credentails.");
                }
                //check password
                const isPasswordCorrect = bcrypt.compare(credentials.password, user.password );
                if(!isPasswordCorrect){
                    throw new Error("Invalid credentails.")
                }
                // Next Auth return (Not Next return response.)
                return {
                    id : user._id.toString(),      //Now we only have id to check session.
                    email : user.email.toString()
                }

            } catch (error) {
                console.log("Next-Auth Error : ", error);
                throw error
            }
        },
    }),
  ],
};
import { NextRequest, NextResponse } from 'next/server';
import * as z from "zod";

import { LoginSchema } from "@/schemas/index";

export async function POST(req: NextRequest) {
    try{
        const {email, password} = LoginSchema.parse(await req.json());
        if(!email || !password){
            return NextResponse.json({error: "Login failed"}, {status: 400});
        }
        return NextResponse.json({message: "Login successful"}, {status: 200});
    
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Login failed"}, {status: 500});
    }
}
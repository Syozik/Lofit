import { NextRequest, NextResponse } from 'next/server';
import * as z from "zod";

import { SignUpSchema } from "@/schemas/index";

export async function POST(req: NextRequest) {
    try{
        const {name, email, password} = SignUpSchema.parse(await req.json());
        if(!name || !email || !password){
            return NextResponse.json({error: "Signing up failed"}, {status: 400});
        }
        return NextResponse.json({message: "Signing up successful"}, {status: 200});
    
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Signing up failed"}, {status: 500});
    }
}
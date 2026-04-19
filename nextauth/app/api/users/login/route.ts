import { connect } from "@/dbconfig/dbconfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    await connect();
    try {
        const { email, password } = await request.json();
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials, user not found" }, { status: 400 })
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials, password invalid" }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            id: user._id.toString(),
        }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
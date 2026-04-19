import { connect } from '@/dbconfig/dbconfig'
import { User } from '@/models/user.model';
import { NextResponse, NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helper/mailer';

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        if (!email) {
            return NextResponse.json(
                { error: "Email is missing from request" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();

        console.log("Sending email to:", email);
        try {
            await sendEmail({
                email,
                emailtype: "VERIFY",
                userId: savedUser._id,
            })
        } catch (error) {
            console.error("Error sending verification email:", error);
        }

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
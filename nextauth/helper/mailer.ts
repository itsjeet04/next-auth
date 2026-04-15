// two methods 
// domain.com/verify-email?token=123456 --> take url using window.location.search --> ifusing client component
// domain.com/verify-email/123456 --> take url using params --> if using server component

import nodemailer from "nodemailer" ;
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";

export const sendEmail = async ({email , emailtype , userId } : any ) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString() , 10) ;

        if(emailtype === "VERIFY"){
        await User.findByIdAndUpdate(userId , {
            verifyToken : hashedToken ,
            verifyTokenExpiry : Date.now() + 3600000
        })
        }else if(emailtype === "RESET"){
            await User.findByIdAndUpdate(userId , {
                forgotPasswordToken : hashedToken ,
                forgotPasswordTokenExpiry : Date.now() + 3600000
            })
        }

        // used mailtrap here 
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "146805784da1cc",
                pass: "756b3e258d1c0d"
            } 
        })

        const mailOptions = {
            from : "jeetsirjan@gmail.com" , 
            to   :  email ,
            subject : emailtype === "VERIFY" ? "Verify your email" : "Reset your password" ,
            html : `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailtype === "VERIFY" ? "verify your email" : "reset your password"} </p>`
        }

        const mailResponse = await transport.sendMail(mailOptions) ;
        return mailResponse ;

    } catch (error : any) {
        throw new Error(error.message)
    }
}
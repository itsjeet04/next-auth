import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isVerified : {
            type : Boolean,
            default : false,
        },
        isAdmin : {
            type : Boolean,
            default : false,
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.models.users || mongoose.model('User',userSchema) 
// if already exists then use that otherwise create a new one , this check is done in nextjs because of hot reloading in server side
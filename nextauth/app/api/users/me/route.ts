import {User} from "@/models/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
    try{
        const userId = await getDataFromToken(request);
        const user = await User.findOne({
            _id: userId
        }).select("-password") ;
        return NextResponse.json({ message : "User found", data :user });
    }catch(error){
        return NextResponse.json({error : "Failed to fetch user data"}, {status : 500})
    }

}
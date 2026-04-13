import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";

export function middleware(request : NextRequest){
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/login" || path === "/signup"
    const token = request.cookies.get("token")?.value || ""
    if(isPublicPath && token){
        return NextResponse.redirect(new URL("/profile", request.url))
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ["/", "/profile", "/login", "/signup" , "/profile/:id*"],
}
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";

export async function POST(req) {
   
    const { sessionName, sessionPassword } = await req.json();
    
    if (!sessionName && !sessionPassword) {
        return NextResponse.json({ error: "No session info available" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token;

    if (!token) {
        return NextResponse.json({ error: "No token available" }, { status: 401 });
    }

    console.log({ value, sessionName, sessionPassword});
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_ZOOM_BASE_URL,
            {
                session_name: sessionName,
                session_password: sessionPassword,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${value}`,
                },
            });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching sessions:", error.message);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
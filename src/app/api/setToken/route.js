import { COOKIE_NAME } from "@/constants";
import { serialize } from "cookie";
import { KJUR } from "jsrsasign"; // Ensure this is installed and imported
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const sdkApiKey = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
        const sdkApiSecret = process.env.NEXT_PUBLIC_ZOOM_API_SECRET;

        if (!sdkApiKey || !sdkApiSecret) {
            throw new Error("Zoom API Key or Secret is missing.");
        }

        const iat = Math.round((new Date().getTime() - 30000) / 1000);
        const exp = iat + 60 * 60 * 2;
        const oHeader = { alg: 'HS256', typ: 'JWT' };
        const oPayload = { iss: sdkApiKey, iat, exp };

        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);
        const token = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkApiSecret);

        const serialized = serialize(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_NODE_ENV_DEV || "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 2, // 2 hours
            path: "/",
        });

        const response = { message: 'Authenticated!' };

        return new NextResponse(JSON.stringify(response), { 
            status: 200,
            headers: { 'Set-Cookie': serialized }
        });
    } catch (error) {
        console.error("Error:", error.message);
        return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
    }
}

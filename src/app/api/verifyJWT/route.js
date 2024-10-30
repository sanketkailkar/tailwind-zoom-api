import { COOKIE_NAME } from "@/constants";
import { KJUR } from "jsrsasign";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME);

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { value } = token;
        const sdkApiSecret = process.env.NEXT_PUBLIC_ZOOM_API_SECRET;

        // Verify the token using `jsrsasign`
        const isValid = KJUR.jws.JWS.verify(value, sdkApiSecret, ["HS256"]);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const response = { message: "Verified!" };

        return new NextResponse(JSON.stringify(response), {
            status: 200,
        });
    } catch (error) {
        console.error("Error:", error.message);
        return NextResponse.json(
            { message: "Something went wrong!" },
            { status: 400 }
        );
    }
}

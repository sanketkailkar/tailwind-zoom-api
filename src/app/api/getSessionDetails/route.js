import { COOKIE_NAME } from '@/constants';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const type = searchParams.get("type");

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token;

    if (!sessionId) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }


    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ZOOM_BASE_URL}/${sessionId}?type=${type}`, {
            headers: {
                "Authorization": `Bearer ${value}`,
                "Accept": 'application/json'
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching sessions:", error.message);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}

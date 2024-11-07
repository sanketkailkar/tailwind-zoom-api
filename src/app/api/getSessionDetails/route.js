import { COOKIE_NAME } from '@/constants';
import { decodeSessionId } from '@/lib/helper';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { sessionId, type } = await req.json();
    const session = decodeSessionId(sessionId);

    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token;

    if (!session) {
        return NextResponse.json({ error: 'Session Id required' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ZOOM_BASE_URL}/${session}?type=${type}`, {
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

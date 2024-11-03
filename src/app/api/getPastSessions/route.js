import { COOKIE_NAME } from '@/constants';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token || {};

    // Parse the JSON body of the POST request
    const { fromDate = '2024-10-28', toDate = '2024-10-28' } = await req.json();

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ZOOM_BASE_URL}?from=${fromDate}&to=${toDate}&type=past`, {
            headers: {
                "Authorization": `Bearer ${value}`,
                "Accept": 'application/json'
            }
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching sessions:", error.message);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}

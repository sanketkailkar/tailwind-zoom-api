import { COOKIE_NAME } from '@/constants';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token || {};

    // Parse the JSON body of the POST request
    const { fromDate, toDate} = await req.json();
    if (!fromDate && !toDate) {
        throw Error ("Please select date range.");
    }

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ZOOM_BASE_URL}?from=${fromDate}&to=${toDate}&type=live`, {
            headers: {
                "Authorization": `Bearer ${value}`,
                "Accept": 'application/json'
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching sessions:", error.message);
        return NextResponse.json({ error: error.message || "Failed to fetch sessions" }, { status: 500 });
    }
}

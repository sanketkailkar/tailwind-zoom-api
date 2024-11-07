import { SESSION } from "@/constants";
import { getSdkToken } from "@/data/getSdkToken";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Script from "next/script";

const Videocall = dynamic(() => import("../../../components/Videocall"), { ssr: false });

export default async function Page({ params, searchParams }) {
    const decodedSlug = decodeURIComponent(params.slug);
    const cookieStore = cookies();

    // Get the pwd from searchParams (query parameter)
    const pwd = searchParams?.pwd || null;
    const username = searchParams?.userName || null;

    // Retrieve and parse the session details
    const sessionDetailsCookie = cookieStore.get(SESSION);
    const sessionDetails = sessionDetailsCookie ? JSON.parse(sessionDetailsCookie.value) : null;

    const { session_name, session_number, session_id, session_password, passcode, created_at } = sessionDetails;

    const jwt = await getSdkToken(decodedSlug);

    return (
        <main>
            <Videocall
                topic={session_name}
                token={jwt}
                sessions_password={session_password}
                sessionId={session_id}
                sessionNumber={session_number}
                isGuest={true}
                userName={username}
                password={pwd}
            />
            <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
        </main>
    );
}

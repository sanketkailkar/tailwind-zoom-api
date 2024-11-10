"use client";
import toastNotification from "@/components/Notification";
import { SESSION } from "@/constants";
import { decodeSessionId, encodeSessionId } from "@/lib/helper";
import { Button, Input } from "antd";
import axios from "axios";
import { serialize } from "cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const JoiningPage = () => {
    const { push } = useRouter();
    const [userName, setUserName] = useState('');
    const fetchTokenCalled = useRef(false);
    const getSessionCalled = useRef(false);
    const [loading, setLoading] = useState(false);
    const [sessionName, setSessionName] = useState('');
    const [isLimitReached, setLimitReached] = useState(false);

    // State variables for session parameters
    const [session, setSession] = useState('');
    const [pwd, setPwd] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setSession(searchParams.get('session'));
            setPwd(searchParams.get('pwd'));
            const SessionId = decodeSessionId(searchParams.get('id'));
            setId(SessionId);
        }
    }, []);

    useEffect(() => {
        if (!session || !id) return;

        const fetchToken = async () => {
            try {
                await axios.post("/api/setToken");
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        if (!fetchTokenCalled.current) {
            fetchToken();
            fetchTokenCalled.current = true;
        }

        const fetchSession = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`/api/getSessionDetails`, {
                    sessionId: encodeSessionId(id),
                    type: "live"
                });
  
                if (response.data.user_count >= 2) {
                    setLimitReached(true);
                    return;
                }
                setSessionName(response.data.session_name);
                const serializedCookie = serialize(SESSION, JSON.stringify(response.data));
                document.cookie = serializedCookie;
            } catch (error) {
                console.error("Error fetching session details:", error);
                toastNotification("error", "Error fetching session.");
            } finally {
                setLoading(false);
            }
        };
        
        if (!getSessionCalled.current) {
            fetchSession();
            getSessionCalled.current = true;
        }
    }, [session]);

    const handleJoinSession = () => {
        if (!userName) {
            toastNotification("error", "User name is required!");
            return;
        }

        if (!sessionName) {
            toastNotification("error", "Session does not exist.");
            return;
        }

        push(`/guestCall/${session}?pwd=${pwd}&userName=${userName}`);
    };

    const handleOnChange = (e) => {
        setUserName(e.target.value);
    };

    return (
        <div>
            <p>Session Title: {session}</p>
            {loading ? (
                "Loading..."
            ) : !isLimitReached ? (
                <>
                    <Input
                        value={userName}
                        onChange={handleOnChange}
                        className="user-name"
                        placeholder="username"
                        type="text"
                        style={{ width: "200px" }}
                    />
                    <Button
                        disabled={!userName}
                        className="flex flex-1"
                        type="primary"
                        onClick={handleJoinSession}
                        title="join session"
                    >
                        Join
                    </Button>
                </>
            ) : (
                <div>Limit Reached</div>
            )}
        </div>
    );
};

export default JoiningPage;

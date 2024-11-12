"use client";
import toastNotification from "@/components/Notification";
import { Button, Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/joiningPage.css";

const JoiningPage = () => {
    const { push } = useRouter();
    const [userName, setUserName] = useState('');
    const [session, setSession] = useState('');
    const [pwd, setPwd] = useState('');

    useEffect(() => {
        // Ensure this runs only in the client
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setSession(searchParams.get('session'));
            setPwd(searchParams.get('pwd'));
        }
    }, []);

    const handleJoinSession = () => {
        if (!userName) {
            toastNotification("error", "User name is required!");
            return;
        }

        push(`/call/${session}?pwd=${pwd}&userName=${userName}`);
    };

    const handleOnChange = (e) => {
        setUserName(e.target.value);
    };

    return (
        <div className="main-container-joining-page">
            <div className="user-input-box">
                <p>Session Title: {session}</p>
                <div className="input-box">
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
                </div>
            </div>
        </div>
    );
};

export default JoiningPage;

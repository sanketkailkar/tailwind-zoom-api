"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../../styles/session-details.css";
import { Button } from "antd";

const SessionDetails = ({ params }) => {
    const { push } = useRouter();
    const sessionId = decodeURIComponent(params.session);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams(window.location.search);
                const type = params.get("type");

                const response = await axios.get(`/api/getSessionDetails?sessionId=${sessionId}&type=${type}`);
                console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching session details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    return (
        <div className="session-container">
            <Button 
            type="primary"
            className="back-btn"
            onClick={() => {
                push("/");
            }}>
                Back
                </Button>
            <h2>Session Details</h2>
            {
                loading ? <p>Loading...</p> :
                    <div className="session-details">
                        <p>Session - {data?.session_name || "-"}</p>
                        <p>Start Time - {data?.start_time || "-"}</p>
                        <p>End Time - {data?.end_time || "-"}</p>
                        <p>Duration - {data?.duration || "-"}</p>
                        <p>User count - {data?.user_count || "-"}</p>
                    </div>
            }
        </div>
    );
};

export default SessionDetails;

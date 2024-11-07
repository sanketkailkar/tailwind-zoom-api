import { Button, Typography } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import "../styles/session-list.css";
import dayjs from "dayjs";
import { encodeSessionId } from "@/lib/helper";

const { Title } = Typography;

const SessionsList = ({ sessions, loading, type, title }) => {
    const { push } = useRouter();

    const handleSessionClick = (sessionId) => {
        const sessionEncoded = encodeSessionId(sessionId);
        push(`/sessionsDetails/${sessionEncoded}?type=${type}`);
    }

    return (
        <div className="session-list-container">
            <Title level={3} className="title"> {title} </Title>
            {loading ? (
                <p>Loading...</p>
            ) : !sessions || sessions.length === 0 ? (
                <p>No sessions found !!!</p>
            ) : (
                <ul>
                    {sessions.map((session, index) => (
                        <li key={index} className="list">
                            <div className="list-info">
                                <h3>{`${index + 1}.`}</h3>
                                <h4>Session name: {session.session_name || "-"}</h4>
                                <h4>Id: {session.id || "-"}</h4>
                                {
                                    type === "live" ?
                                        <>
                                            <h4>Start Date: {dayjs(session.start_time).format("YYYY-MM-DD") || "-"}</h4>
                                            <h4>Users: {session.user_count || "-"}</h4>
                                        </> :
                                        <>
                                            <h4>End Date: {dayjs(session.end_time).format("YYYY-MM-DD") || "-"}</h4>
                                            <h4>Users: {session.user_count || "-"}</h4>
                                        </>
                                }
                            </div>
                            <Button onClick={() => handleSessionClick(session.id, type)}>Details</Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SessionsList;

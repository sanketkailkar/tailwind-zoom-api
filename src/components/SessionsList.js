import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import "../styles/session-list.css";

const SessionsList = ({ sessions, loading, type }) => {
    const { push } = useRouter();

    const handleSessionClick = (sessionId) => {
        push(`/sessionsDetails/${sessionId}?type=${type}`);
    }

    return (
        <div className="session-list-container">
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

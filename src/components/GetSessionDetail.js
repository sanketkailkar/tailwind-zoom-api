"use client"
import axios from "axios"
const { useEffect, useState } = require("react")

const SessionDetails = () => {

    const [msg, setMsg] = useState();

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                const { data } = await axios.get("/api/getSessionsDetails");
                setMsg(JSON.stringify(data));
              } catch (error) {
                console.error("Error fetching sessions:", error);
              }
        }
        fetchSessionDetails();
    })

    return (
        <div>
            <h3>Sessions</h3>
            <p>{msg}</p>
        </div>
    )
}

export default SessionDetails;
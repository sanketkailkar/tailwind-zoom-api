"use client"

import axios from "axios"

const { useEffect, useState } = require("react")

const AllSessions = () => {

    const [msg, setMsg] = useState();

    useEffect(() => {
        const fetchAllSessions = async () => {
            try {
                const { data } = await axios.get("/api/verifyJWT");
                setMsg(data.message);
              } catch (error) {
                console.error("Error fetching sessions:", error);
              }
        }
        fetchAllSessions();
    })

    return (
        <div>
            <h3>All Sessions</h3>
            <p>{msg}</p>
        </div>
    )
}

export default AllSessions;
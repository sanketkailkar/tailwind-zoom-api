"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import SessionsList from "../components/SessionsList";
import { useRouter } from "next/navigation";
import "../styles/homePage.css";

export default function Home() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pastSessions, setPastSessions] = useState([]);
  const [isLiveSessionLoading, setIsLiveSessionLoading] = useState(false);
  const [liveSessions, setLiveSessions] = useState([]);

  const [sessionName, setSessionName] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const VerifyJWT = async () => {
    try {
      const { data } = await axios.get("/api/verifyJWT");
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }

  const fetchAllPastSessions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/getPastSessions");
      setPastSessions(data.sessions);

    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchAllLiveSessions = async () => {
    try {
      setIsLiveSessionLoading(true);
      const { data } = await axios.get("/api/getLiveSessions");
      setLiveSessions(data.sessions);

    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLiveSessionLoading(false);
    }
  }

  const handleCreateSession = async () => {
    if (!sessionName || !sessionPassword) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setIsCreatingSession(true);
      const response = await axios.post("/api/createSessions", {
        sessionName,
        sessionPassword,
      });
      console.log("CREATE", response);
    } catch (error) {
      console.error("Failed to create session:", error.message);
    } finally {
      setIsCreatingSession(false);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.post("/api/setToken");
        console.log(data);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }
    const getData = async () => {
      await fetchToken();
      await VerifyJWT();
      fetchAllPastSessions();
      fetchAllLiveSessions();
    }
    getData();
  }, []);

  return (
    <div className="main-container">
      <div className="user-input-container">
        <h1>Zoom Sessions</h1>
        <div className="input-and-buttons">
          <input
            type="text"
            placeholder="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="session-input"
          />
          <input
            type="text"
            placeholder="Password/Passcode"
            value={sessionPassword}
            onChange={(e) => setSessionPassword(e.target.value)}
            className="session-input"
          />
          <button
            variant="primary"
            disabled={!sessionName || isCreatingSession}
            onClick={handleCreateSession}
            className="create-session-button"
          >
            {isCreatingSession ? "Creating Session..." : "Create Session"}
          </button>
        </div>
      </div>

      <h2>Past Sessions</h2>
      <SessionsList sessions={pastSessions} loading={isLoading} type={"past"}/>

      <h2>Live Sessions</h2>
      <SessionsList sessions={liveSessions} loading={isLiveSessionLoading} type={"live"}/>
    </div>
  );
}

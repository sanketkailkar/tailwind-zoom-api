"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SessionsList from "../components/SessionsList";
import { useRouter } from "next/navigation";
import "../styles/homePage.css";
import { Button, DatePicker, Input, Form, Typography } from "antd";
import dayjs from "dayjs";
import { SESSION } from "@/constants";
import { serialize } from "cookie";
import toastNotification from "@/components/Notification";

const { Title } = Typography;

export default function Home() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pastSessions, setPastSessions] = useState([]);
  const [isLiveSessionLoading, setIsLiveSessionLoading] = useState(false);
  const [liveSessions, setLiveSessions] = useState([]);

  const [sessionName, setSessionName] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [dates, setDates] = useState({ fromDate: null, toDate: null });

  const isFetched = useRef(false);
  const initialLoad = useRef(true);

  const verifyJWT = async () => {
    try {
      await axios.get("/api/verifyJWT");
    } catch (error) {
      console.error("Error verifying JWT:", error);
    }
  };

  const fetchAllPastSessions = async () => {
    try {
      const fromDate = dates.fromDate || dayjs().format("YYYY-MM-DD");
      const toDate = dates.toDate || dayjs().format("YYYY-MM-DD");

      setIsLoading(true);
      const { data } = await axios.post("/api/getPastSessions", {
        fromDate,
        toDate,
      });
      setPastSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching past sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllLiveSessions = async () => {
    try {
      const fromDate = dates.fromDate || dayjs().format("YYYY-MM-DD");
      const toDate = dates.toDate || dayjs().format("YYYY-MM-DD");

      setIsLiveSessionLoading(true);
      const { data } = await axios.post("/api/getLiveSessions", {
        fromDate,
        toDate,
      });
      setLiveSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching live sessions:", error);
    } finally {
      setIsLiveSessionLoading(false);
    }
  };

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

      // Serializing response.data to set as a cookie
      const serializedCookie = serialize(SESSION, JSON.stringify(response.data));

      // Setting cookie using document.cookie on the client side
      document.cookie = serializedCookie;
      const encodedPwd = encodeURI(response.data.session_password);
      // push(`/call/${response.data.session_name}?pwd=${encodedPwd}`);
      push(`/join?session=${response.data.session_name}&pwd=${encodedPwd}`);
      // router.push(`/call/${sessionName}`);
    } catch (error) {
      console.error("Failed to create session:", error.response.data.error);
      toastNotification("error", error.response.data.error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDateChange = (field, value) => {
    const formattedDate = value ? dayjs(value).format("YYYY-MM-DD") : null;
    setDates((prevDates) => ({ ...prevDates, [field]: formattedDate }));
  };

  const handleSubmit = () => {
    if (dates.fromDate && dates.toDate) {
      setSubmit(true);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        await axios.post("/api/setToken");
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (!isFetched.current) {
      isFetched.current = true;
      fetchToken();
      verifyJWT();
    }
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      fetchAllPastSessions();
      fetchAllLiveSessions();
    } else if (submit) {
      fetchAllPastSessions();
      fetchAllLiveSessions();
      setSubmit(false);
    }
  }, [submit]);

  return (
    <div className="main-container">
      <div className="user-input-container">
        <Title level={2}>Zoom Sessions</Title>
        <div className="input-and-buttons">
          <Input
            type="text"
            placeholder="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="session-input"
          />
          <Input
            type="text"
            placeholder="Password/Passcode"
            value={sessionPassword}
            onChange={(e) => setSessionPassword(e.target.value)}
            className="session-input"
          />
          <Button
            type="primary"
            disabled={!sessionName || isCreatingSession}
            onClick={handleCreateSession}
            className="create-session-button"
          >
            {isCreatingSession ? "Creating Session..." : "Create Session"}
          </Button>
        </div>
      </div>

      <div className="past-and-live-sessions">
        <Title level={2}>Past and Live Sessions</Title>
        <Form form={form} layout="inline" className="select-date">
          <Form.Item name="fromDate" label="From">
            <DatePicker
              placeholder="From"
              onChange={(value) => handleDateChange("fromDate", value)}
              value={dates.fromDate ? dayjs(dates.fromDate) : null}
            />
          </Form.Item>

          <Form.Item name="toDate" label="To">
            <DatePicker
              placeholder="To"
              onChange={(value) => handleDateChange("toDate", value)}
              value={dates.toDate ? dayjs(dates.toDate) : null}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!dates.fromDate || !dates.toDate}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <SessionsList sessions={pastSessions} loading={isLoading} type={"past"} title={"Past Sessions"}/>

      <SessionsList sessions={liveSessions} loading={isLiveSessionLoading} type={"live"} title={"Live Sessions"}/>
    </div>
  );
}

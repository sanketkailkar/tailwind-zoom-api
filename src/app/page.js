"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import SessionsList from "../components/SessionsList";
import { useRouter } from "next/navigation";
import "../styles/homePage.css";
import { Button, DatePicker, Input, Form, Typography } from "antd";
import dayjs from 'dayjs';

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
      const { data } = await axios.post("/api/getPastSessions", {
        fromDate: dates.fromDate,
        toDate: dates.toDate
      });
      setPastSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllLiveSessions = async () => {
    try {
      setIsLiveSessionLoading(true);
      const { data } = await axios.post(`/api/getLiveSessions`, {
        fromDate: dates.fromDate,
        toDate: dates.toDate
      });
      setLiveSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
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
      console.log("CREATE", response);
    } catch (error) {
      console.error("Failed to create session:", error.message);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDateChange = (field, value) => {
    const formattedDate = value ? dayjs(value).format("YYYY-MM-DD") : null;
    setDates(prevDates => ({ ...prevDates, [field]: formattedDate }));
  };

  const handleSubmit = () => {
    if (dates.fromDate && dates.toDate) {
      setSubmit(true);
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
    }
    getData();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchAllPastSessions();
      fetchAllLiveSessions();
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

      <div>
        <Title level={2}>Past and Live Sessions</Title>
        <Form form={form} layout="inline" className="select-date">
          <Form.Item name="fromDate" label="From">
            <DatePicker
              placeholder="From"
              onChange={(value) => handleDateChange('fromDate', value)}
              value={dates.fromDate ? dayjs(dates.fromDate) : null}
            />
          </Form.Item>

          <Form.Item name="toDate" label="To">
            <DatePicker
              placeholder="To"
              onChange={(value) => handleDateChange('toDate', value)}
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

      <Title level={2}>Past Sessions</Title>
      <SessionsList sessions={pastSessions} loading={isLoading} type={"past"} />

      <Title level={2}>Live Sessions</Title>
      <SessionsList sessions={liveSessions} loading={isLiveSessionLoading} type={"live"} />
    </div>
  );
}

"use client"
import { zoomClient } from "@/lib/ZoomClient";
import { VideoQuality } from "@zoom/videosdk";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import "../styles/videoCall.css";
import { CameraButton, EndCallButton, MicButton } from "./MuteButtons";
import toastNotification from "./Notification";
import { encodeSessionId } from "@/lib/helper";
import { getSessionInfo } from "@/services/service";

const Videocall = (props) => {
  const { topic, token, sessions_password, sessionId, userName, password, isGuest } = props;

  const [inSession, setInSession] = useState(false);
  const client = useRef(zoomClient);
  const [isVideoMuted, setIsVideoMuted] = useState(true); // Start with video muted
  const [isAudioMuted, setIsAudioMuted] = useState(true); // Start with audio muted
  const videoContainerRef = useRef(null);
  const userContainerRef = useRef(null);
  const sessionJoined = useRef(false);
  const [participants, setParticipants] = useState([]); // Track participants

  const joinSession = async () => {
    const sessionDetails = await getSessionInfo(sessionId);

    if (sessionDetails?.user_count === 2) {
      toastNotification("error", "Number of users limit reached!!!");
      return;
    }

    if (!userName) {
      toastNotification("error", "Username is required");
      return;
    }

    if (!password) {
      toastNotification("error", "Password is required");
      return;
    }

    await client.current.init("en-US", "Global", { patchJsMedia: true });

    client.current.on("peer-video-state-change", (payload) => renderVideo(payload));
    client.current.on("user-added", (event) => addParticipant(event));
    client.current.on("user-removed", (event) => removeParticipant(event.userId));

    await client.current.join(topic, token, userName, password).catch((e) => {
      console.log(e);
    });
    setInSession(true);

    // Initialize audio and video settings
    const mediaStream = client.current.getMediaStream();
    await mediaStream.stopAudio();
    await mediaStream.stopVideo();
    setIsAudioMuted(true);
    setIsVideoMuted(true);
  };

  useEffect(() => {
    if (!sessionJoined.current) {
      sessionJoined.current = true;
      joinSession();
    }
  }, []);

  const addParticipant = (event) => {
    if (participants.length >= 2) {
      return;
    }
    const newParticipants = event.map(user => ({
      userId: user.userId,
      userName: user.displayName || `User ${user.userId}`,
    }));

    setParticipants(prevParticipants => [
      ...prevParticipants,
      ...newParticipants,
    ]);
  };

  const removeParticipant = (userId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.userId !== userId)
    );
  };

  const renderVideo = async (event) => {
    const mediaStream = client.current.getMediaStream();

    if (event.action === "Stop") {
      const elements = await mediaStream.detachVideo(event.userId);
      if (Array.isArray(elements)) {
        elements.forEach((el) => el.remove());
      } else {
        elements?.remove();
      }
    } else {
      const userVideo = await mediaStream.attachVideo(
        event.userId,
        VideoQuality.Video_360P
      );
      videoContainerRef.current.appendChild(userVideo);
    }
  };

  const leaveSession = async () => {
    client.current.off("peer-video-state-change", (payload) => renderVideo(payload));
    client.current.off("user-added", (event) => addParticipant(event));
    client.current.off("user-removed", (event) => removeParticipant(event.userId));

    await client.current.leave().catch((e) => console.log("leave error", e));
    window.location.href = "/";
  };

  const copyToClipboard = () => {
    const sessionEncoded = encodeSessionId(sessionId);
    const inviteLink = `${window.location.origin}/guest?session=${topic}&pwd=${sessions_password}&id=${sessionEncoded}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toastNotification("success", "Link Copied !!!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const UserContainer = ({ username }) => (
    <div className="user-container" ref={userContainerRef}>
      <div className="user-name-body">
        <p className="user-name">{username}</p>
      </div>
    </div>
  );

  return (
    <div className="video_player_container">
      <h2 className="session-title">
        <span>Session: {topic}</span>
        <Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
          Copy Link
        </Button>
      </h2>

      <div className="video-container" style={inSession ? {} : { display: "none" }}>
        <video-player-container ref={videoContainerRef} style={videoPlayerStyle} >
          {isVideoMuted &&
            <div className="participants">
              {participants.map((participant) => (
                <UserContainer key={participant.userId} username={participant.userName} />
              ))}
            </div>
          }
        </video-player-container>
      </div>
      <div className="call-btn-container">
        <div className="call-btn-div">
          <CameraButton
            client={client}
            isVideoMuted={isVideoMuted}
            setIsVideoMuted={setIsVideoMuted}
            renderVideo={renderVideo}
          />
          <MicButton
            isAudioMuted={isAudioMuted}
            client={client}
            setIsAudioMuted={setIsAudioMuted}
          />
            <Button type="primary" danger onClick={leaveSession} title="leave session">
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Videocall;

const videoPlayerStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "stretch",
  height: "100%",
  width: "100%",
  padding: "20px",
  boxSizing: "border-box",
  overflow: "hidden",
};

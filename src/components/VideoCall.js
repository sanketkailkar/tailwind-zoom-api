"use client";
import { useEffect, useRef, useState } from 'react';
import { zoomClient } from '@/lib/ZoomClient';
import JoiningPage from './JoinPage';
import { Button, Input } from 'antd';
import toastNotification from './Notification';
import { CameraButton, MicButton } from './MuteButtons';

const VideoCall = ({ sessionName, token }) => {
  const client = useRef(zoomClient);
  const [userName, setUsername] = useState('');
  const [inSession, setInSession] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const videoContainerRef = useRef(null);

  // Meeting details state
  const [meetingDetails, setMeetingDetails] = useState({
    session: '',
    userId: [],
    userName: [],
  });

  const joinSession = async () => {
    if (!userName) {
      toastNotification("error", "Username is required");
      return;
    }

    await client.current.init("en-US", "Global", { patchJsMedia: true });

    client.current.on("peer-video-state-change", (payload) => void renderVideo(payload));

    try {
      await client.current.join(sessionName, token, userName)
      .then(console.log("JOINED"))
      .catch((e) => {console.log("Joining Failed", e)});
      console.log('Joined Zoom Session as:', userName);
      setInSession(true);

      // Add user to meeting details
      const currentUserId = client.current.getCurrentUserInfo().userId;
      setMeetingDetails(prev => ({
        ...prev,
        session: sessionName,
        userId: [...prev.userId, currentUserId],
        userName: [...prev.userName, userName],
      }));

      const mediaStream = client.current.getMediaStream();
      await mediaStream.startAudio();
      setIsAudioMuted(mediaStream.isAudioMuted());

      await mediaStream.startVideo();
      setIsVideoMuted(!mediaStream.isCapturingVideo());

      await renderVideo({
        action: "Start",
        userId: currentUserId,
      });
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const leaveSession = async () => {
    client.current.off("peer-video-state-change", (payload) => void renderVideo(payload));

    const userId = client.current.getCurrentUserInfo().userId;

    // Remove user from meeting details
    setMeetingDetails(prev => ({
      ...prev,
      userId: prev.userId.filter(id => id !== userId),
      userName: prev.userName.filter(name => name !== userName),
    }));

    await client.current.leave().catch((e) => console.log("leave error", e));

    // Refresh the page to clear the session state
    window.location.href = "/";
  };

  const renderVideo = async (event) => {
    const mediaStream = client.current.getMediaStream();

    if (event.action === "Stop") {
      const element = await mediaStream.detachVideo(event.userId);
      Array.isArray(element)
        ? element.forEach((el) => el.remove())
        : element.remove();
    } else {
      const userVideo = await mediaStream.attachVideo(
        event.userId,
        VideoQuality.Video_360P
      );
      videoContainerRef.current.appendChild(userVideo);
    }
  };

  const copyToClipboard = () => {
    const inviteLink = `${window.location.origin}/call/${sessionName}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toastNotification("success", "Link Copied !!!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="video_player_container">
      <h2 className="session-title">
        <span>Session: {sessionName || "-"}</span>
        <Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
          Copy Link
        </Button>
      </h2>

      <div
        className="video-container"
        style={inSession ? {} : { display: "none" }}
      >
        <video-player-container ref={videoContainerRef} style={videoPlayerStyle} />
      </div>

      {!inSession ? (
        <>
        <Input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="user-name"
          placeholder="username"
          type="text"
          style={{ width: "200px" }}
        />
        <Button className="flex flex-1" type="primary" onClick={joinSession} title="join session">
          Join
        </Button>
      </>
      ) : (
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
            <Button type="primary" onClick={leaveSession} title="leave session">
              Leave
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;

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

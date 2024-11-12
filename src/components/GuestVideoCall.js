// "use client"
// import { zoomClient } from "@/lib/ZoomClient";
// import { VideoQuality } from "@zoom/videosdk";
// import { Button } from "antd";
// import { useEffect, useRef, useState } from "react";
// import "../styles/videoCall.css";
// import { CameraButton, MicButton, ScreenShareButton } from "./MuteButtons";
// import toastNotification from "./Notification";
// import { encodeSessionId } from "@/lib/helper";

// const GuestVideoCall = (props) => {
//   const { topic, token, sessions_password, sessionId, userName, password, isGuest } = props;

//   const [inSession, setInSession] = useState(false);
//   const [isVideoMuted, setIsVideoMuted] = useState(true);
//   const [isAudioMuted, setIsAudioMuted] = useState(true);
//   const [isEmpty, setIsEmpty] = useState(true);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);

//   const client = useRef(zoomClient);
//   const videoContainerRef = useRef(null);
//   const sessionJoined = useRef(false);
//   const onScreenShareClickRef = useRef(null);

//   const joinSession = async () => {
//     if (!userName) {
//       toastNotification("error", "Username is required");
//       return;
//     }

//     if (!password) {
//       toastNotification("error", "Password is required");
//       return;
//     }

//     await client.current.init("en-US", "Global", { patchJsMedia: true });

//     client.current.on("peer-video-state-change", renderVideo);
//     client.current.on("active-share-change", handleActiveShareChange);

//     await client.current.join(topic, token, userName, password).catch((e) => {
//       console.log(e);
//     });
//     setInSession(true);

//     // Initialize audio and video settings
//     const mediaStream = client.current.getMediaStream();
//     await mediaStream.stopAudio();
//     await mediaStream.stopVideo();
//     setIsAudioMuted(true);
//     setIsVideoMuted(true);

//     client.current.getAllUser().forEach((user) => {
//       if (user.sharerOn) {
//         mediaStream.startShareView(
//           document.querySelector("#users-screen-share-content-canvas"),
//           user.userId
//         );
//       }
//     });
//   };

//   useEffect(() => {
//     if (!sessionJoined.current) {
//       sessionJoined.current = true;
//       joinSession();
//     }
//   }, []);

//   useEffect(() => {
//     if (client) {
//       client.current.on('passively-stop-share', (payload) => {
//         console.log('Screen sharing stopped:', payload);
//         if (onScreenShareClickRef.current) {
//           onScreenShareClickRef.current();
//         }
//       });
//     }
//     return () => {
//       if (client) {
//         client.current.off('passively-stop-share');
//       }
//     };
//   }, [client]);

//   const handleActiveShareChange = (payload) => {
//     const mediaStream = client.current.getMediaStream();
//     if (payload.state === "Active") {
//       mediaStream.startShareView(
//         document.querySelector("#users-screen-share-content-canvas"),
//         payload.userId
//       );
//       setIsScreenSharing(true);
//     } else {
//       mediaStream.stopShareView();
//       setIsScreenSharing(false);
//     }
//   };

//   const renderVideo = async (event) => {
//     const mediaStream = client.current.getMediaStream();

//     if (event.action === "Stop") {
//       const elements = await mediaStream.detachVideo(event.userId);
//       if (Array.isArray(elements)) {
//         elements.forEach((el) => el.remove());
//       } else {
//         elements?.remove();
//       }
//     } else {
//       const userVideo = await mediaStream.attachVideo(
//         event.userId,
//         VideoQuality.Video_360P
//       );
//       videoContainerRef.current.appendChild(userVideo);

//     };
//     setIsEmpty(videoContainerRef.current.children.length === 0);
//   }

//   const leaveSession = async () => {

//     client.current.off("peer-video-state-change", renderVideo);
//     client.current.off("active-share-change", handleActiveShareChange);

//     await client.current.leave().catch((e) => console.log("leave error", e));
//     window.location.href = "/";
//   };

//   const copyToClipboard = () => {
//     const sessionEncoded = encodeSessionId(sessionId);
//     const inviteLink = `${window.location.origin}/guest?session=${topic}&pwd=${sessions_password}&id=${sessionEncoded}`;
//     navigator.clipboard.writeText(inviteLink)
//       .then(() => {
//         toastNotification("success", "Link Copied !!!");
//       })
//       .catch((err) => {
//         console.error("Failed to copy: ", err);
//       });
//   };

//   return (
//     <div className="video_player_container">
//       <h2 className="session-title">
//         <span>Session: {topic}</span>
//         <Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
//           Copy Link
//         </Button>
//       </h2>

//       <div className="video-container" style={inSession ? {} : { display: "none" }}>
//         <video-player-container ref={videoContainerRef} style={videoPlayerStyle} >
//           {isEmpty && !isScreenSharing && <>
//             <div className="no-one-shared-screen">
//               <p>No one started a video</p>
//             </div>
//           </>}
//           {/* <video id="my-screen-share-content-video"
//             // height={"100%"} width={"100%"}
//             style={isScreenSharing ? {} : { display: "none" }}
//           ></video>
//           <canvas id="users-screen-share-content-canvas"
//             // height={"100%"} width={"100%"}
//             style={isScreenSharing ? {} : { display: "none" }}
//           ></canvas> */}

//           <video id="my-screen-share-content-video" style={{ display: isScreenSharing ? "block" : "none" }}></video>
//           <canvas id="users-screen-share-content-canvas" style={{ display: isScreenSharing ? "block" : "none" }}></canvas>
//         </video-player-container>
//       </div>

//       <div className="call-btn-container">
//         <div className="call-btn-div">
//           <CameraButton
//             client={client}
//             isVideoMuted={isVideoMuted}
//             setIsVideoMuted={setIsVideoMuted}
//             renderVideo={renderVideo}
//           />
//           <MicButton
//             isAudioMuted={isAudioMuted}
//             client={client}
//             setIsAudioMuted={setIsAudioMuted}
//           />
//           {/* <GuestScreenShareButton
//             client={client}
//             isScreenSharing={isScreenSharing}
//             setIsScreenSharing={setIsScreenSharing}
//           /> */}
//           <ScreenShareButton
//             client={client}
//             isScreenSharing={isScreenSharing}
//             setIsScreenSharing={setIsScreenSharing}
//             onScreenShareClickRef={onScreenShareClickRef}
//           />
//           <Button type="primary" danger onClick={leaveSession} title="leave session">
//             Leave
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestVideoCall;

// const videoPlayerStyle = {
//   display: "flex",
//   justifyContent: "center",
//   flexDirection: "row",
//   alignItems: "stretch",
//   height: "100%",
//   width: "100%",
//   // padding: "20px",
//   boxSizing: "border-box",
//   overflow: "hidden",
// };

"use client"
import { zoomClient } from "@/lib/ZoomClient";
import { VideoQuality } from "@zoom/videosdk";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import "../styles/videoCall.css";
import { CameraButton, ScreenShareButton } from "./MuteButtons";
import toastNotification from "./Notification";
import { encodeSessionId } from "@/lib/helper";
import { Mic, MicOff } from "lucide-react";

const GuestVideoCall = (props) => {
  const { topic, token, sessions_password, sessionId, userName, password, isGuest } = props;

  const [inSession, setInSession] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const client = useRef(zoomClient);
  const videoContainerRef = useRef(null);
  const sessionJoined = useRef(false);
  const onScreenShareClickRef = useRef(null);

  const joinSession = async () => {
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
    client.current.on("active-share-change", handleActiveShareChange);

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

    client.current.getAllUser().forEach((user) => {
      if (user.sharerOn) {
        mediaStream.startShareView(
          document.querySelector("#users-screen-share-content-canvas"),
          user.userId
        );
      }
    });
  };

  useEffect(() => {
    if (!sessionJoined.current) {
      sessionJoined.current = true;
      joinSession();
    }
  }, []);

  useEffect(() => {
    if (client) {
      client.current.on('passively-stop-share', (payload) => {
        console.log('Screen sharing stopped:', payload);
        if (onScreenShareClickRef.current) {
          onScreenShareClickRef.current();
        }
      });
    }
    return () => {
      if (client) {
        client.current.off('passively-stop-share');
      }
    };
  }, [client]);


  const handleActiveShareChange = (payload) => {
    const mediaStream = client.current.getMediaStream();

    if (payload.state === "Active") {
      mediaStream.startShareView(
        document.querySelector("#users-screen-share-content-canvas"),
        payload.userId
      );
      setIsScreenSharing(true);
    } else if (payload.state === "Inactive") {
      mediaStream.stopShareView();
      setIsScreenSharing(false);
    }
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

    };
    setIsEmpty(videoContainerRef.current.children.length === 0);
  }

  const leaveSession = async () => {

    client.current.off("peer-video-state-change", renderVideo);
    client.current.off("active-share-change", handleActiveShareChange);

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

  const toggleAudio = () => {
    const mediaStream = client.current.getMediaStream();
    if (isAudioMuted) {
      mediaStream.startAudio();
    } else {
      mediaStream.stopAudio();
    }
    setIsAudioMuted(!isAudioMuted);
  };

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
          {isEmpty && !isScreenSharing && <>
            <div className="no-one-shared-screen">
              <p>No one started a video</p>
            </div>
          </>}
          <video id="my-screen-share-content-video" style={isScreenSharing ? {} : { display: "none" }}></video>
          <canvas id="users-screen-share-content-canvas" style={isScreenSharing ? {} : { display: "none" }}></canvas>
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
          <Button type="primary" onClick={toggleAudio}>
            {isAudioMuted ? <MicOff /> : <Mic />}
          </Button>
          <ScreenShareButton
            client={client}
            isScreenSharing={isScreenSharing}
            setIsScreenSharing={setIsScreenSharing}
            onScreenShareClickRef={onScreenShareClickRef}
          />
          <Button type="primary" danger onClick={leaveSession} title="leave session">
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestVideoCall;

const videoPlayerStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "stretch",
  height: "100%",
  width: "100%",
  // padding: "20px",
  boxSizing: "border-box",
  overflow: "hidden",
};

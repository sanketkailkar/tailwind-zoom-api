import { Mic, MicOff, ScreenShare, ScreenShareOff, Video, VideoOff } from "lucide-react";
import { Button } from "antd";

const MicButton = (props) => {
  const { client, isAudioMuted, setIsAudioMuted, userName } = props;

  const onMicrophoneClick = async () => {
    const mediaStream = client.current.getMediaStream();
    isAudioMuted ? await mediaStream?.unmuteAudio() : await mediaStream?.muteAudio();
    setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
  };

  return (
    <div onClick={onMicrophoneClick} title="microphone">
      <Button type="primary">
        {isAudioMuted ? <MicOff /> : <Mic />}
      </Button>
    </div>
  );
};

const CameraButton = (props) => {
  const { client, isVideoMuted, setIsVideoMuted, renderVideo, userName } = props;

  const onCameraClick = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isVideoMuted) {
      await mediaStream.startVideo();
      setIsVideoMuted(false);
      await renderVideo({
        action: "Start",
        userId: client.current.getCurrentUserInfo().userId,
      });
    } else {
      await mediaStream.stopVideo();
      setIsVideoMuted(true);
      await renderVideo({
        action: "Stop",
        userId: client.current.getCurrentUserInfo().userId,
      });
    }
  };

  return (
    <div onClick={onCameraClick} title="camera">
      <Button type="primary">
        {isVideoMuted ? <VideoOff /> : <Video />}
      </Button>
    </div>
  );
};

const ScreenShareButton = (props) => {
  const { client, isScreenSharing, setIsScreenSharing, renderVideo, isGuest = false } = props;

  const onScreenShareClick = async () => {
    const mediaStream = client.current.getMediaStream();

    try {
      if (isScreenSharing) {
        await mediaStream.stopShareScreen();
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        if (mediaStream.isStartShareScreenWithVideoElement()) {
          await mediaStream.startShareScreen(
            document.querySelector("#my-screen-share-content-video")
          );
        } else {
          await mediaStream.startShareScreen(
            document.querySelector("#my-screen-share-content-canvas")
          );
        }
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen sharing:", error);
    }
  };

  return (
    <div onClick={onScreenShareClick} title="screen share">
      <Button type="primary">
        {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
      </Button>
    </div>
  );
}

const GuestScreenShareButton = (props) => {
  const { client, isScreenSharing, setIsScreenSharing, renderVideo, isGuest = false } = props;

  const onScreenShareClick = async () => {
    const mediaStream = client.current.getMediaStream();

    try {
      if (isScreenSharing) {
        await mediaStream.stopShareScreen();
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        if (mediaStream.isStartShareScreenWithVideoElement()) {
          await mediaStream.startShareScreen(
            document.querySelector("#guest-screen-share-content-video")
          );
        } else {
          await mediaStream.startShareScreen(
            document.querySelector("#guest-screen-share-content-canvas")
          );
        }
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen sharing:", error);
    }
  };

  return (
    <div onClick={onScreenShareClick} title="screen share">
      <Button type="primary">
        {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
      </Button>
    </div>
  );
}

export { MicButton, CameraButton, ScreenShareButton, GuestScreenShareButton };

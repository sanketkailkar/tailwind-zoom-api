import { Button } from "antd";
import { ScreenShare, ScreenShareOff, Video, VideoOff } from "lucide-react";
import { useEffect } from "react";

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
  const { client, isScreenSharing, setIsScreenSharing, onScreenShareClickRef } = props;

  let disabled;
  const onScreenShareClick = async () => {
    const mediaStream = client.current.getMediaStream();

    try {
      const isScreenShared = await mediaStream.stopShareScreen().length;
      console.log(isScreenShared);
      disabled = isScreenShared === 2 ? true : false;

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

  useEffect(() => {
    if (onScreenShareClickRef) {
      onScreenShareClickRef.current = onScreenShareClick;
    }
  }, [onScreenShareClick]);

  return (
    <div onClick={onScreenShareClick} title="screen share">
      {
        disabled ? <p>disabled</p> :
          <Button type="primary">
            {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
          </Button>
      }
    </div>
  );
}

export { CameraButton, ScreenShareButton };


import { useRef } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "antd";

const MicButton = (props) => {
  const { client, isAudioMuted, setIsAudioMuted } = props;

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
  const { client, isVideoMuted, setIsVideoMuted, renderVideo } = props;

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

export { MicButton, CameraButton };

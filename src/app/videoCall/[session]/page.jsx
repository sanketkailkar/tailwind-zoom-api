import toastNotification from '@/components/Notification';
import VideoCall from '@/components/VideoCall';
import { COOKIE_NAME } from '@/constants';
import { cookies } from 'next/headers';

const VideoCallPage = ({ params }) => {
    const sessionName = params.session;

    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const { value } = token;

    console.log({ sessionName, value });
    
    if (!sessionName && !value) {
        toastNotification("error", "Session name is not available.");
        return null; // Return null to avoid rendering anything
    }

    return (
        <div>
            {sessionName && value ? (
                <VideoCall sessionName={sessionName} token={value} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default VideoCallPage;

import { notification } from "antd";

/**
 * Wrapper for antd Notification
 * @see https://ant.design/components/notification/#API
 *
 * @param {("success"|"error"|"info"|"warning")} state - Notification Type
 * @param {String} message
 */
const toastNotification = (
    state,
    message,
    placement = "topRight",
    duration = 2,
    closeIcon = "x"
) => {
    notification[state]({
        message: message,
        placement,
        duration,
        closeIcon: closeIcon,
        style: {
          width: 300,
          
        }
    });
};

export default toastNotification;

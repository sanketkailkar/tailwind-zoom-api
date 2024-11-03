const { clsx } = require("clsx");
const { twMerge } = require("tailwind-merge");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const meetingArgs = {
  session: '',
  userId: [],
  userNames: [],
};

module.exports = { cn, meetingArgs };

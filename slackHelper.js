const axios = require("axios");
const {SLACK_TOKEN, DEBUG_CHANNEL, SILENCE_MODE} = require("./config");
const url = 'https://slack.com/api/chat.postMessage';


async function sendSlackMsg(msg) {
  if (SILENCE_MODE) {
    console.warn("SILENCE_MODE enabled, messages not sending to slack !!!!");
    return;
  }
  return axios.post(url, msg, {
    headers: {
      authorization: `Bearer ${SLACK_TOKEN}`
    }
  });
}


async function slackErrorMessage(msg) {
  return sendSlackMsg({
    channel: DEBUG_CHANNEL,
    text: msg,
  });
}

module.exports = {
  sendSlackMsg,
  slackErrorMessage
}

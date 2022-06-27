const SLACK_TOKEN = process.env.SLACK_TOKEN;
const DEBUG_CHANNEL =  process.env.DEBUG_CHANNEL;
const CHANNEL = process.env.CHANNEL;
const DEBUG_MODE = process.env.DEBUG_MODE === "true";
const SILENCE_MODE = process.env.SILENCE_MODE === "true";

module.exports = {
  SLACK_TOKEN,
  DEBUG_CHANNEL,
  CHANNEL,
  DEBUG_MODE,
  SILENCE_MODE,
}

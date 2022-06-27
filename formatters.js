const {timeSince} = require("./utils");
const {getBudget, getHourlyRange} = require("./parsers");
const mrkdwn = require("amo-html-to-mrkdwn");



const cleanUpDescription = (description, skip, thread_ts) => {
  let text = ""
  const budget = getBudget(description);
  if (budget) {
    text = `Budget: *$${budget}*`
  }
  const hourly = getHourlyRange(description);
  if (hourly) {
    text = `Hourly: *$${hourly[0]}-$${hourly[1]}*`
  }
  if (thread_ts) {
    return mrkdwn(description).text;
  }
  if (skip) {
    description = formatDescription(description);
    return mrkdwn(description).text;
  }
  return text;
}



const formatDescription = (description) => {
  const regexs = [
    /<b>Budget<\/b>/,
    /<b>Hourly Range<\/b>/,
    /<b>Posted On<\/b>/,
  ]

  for (let r of regexs ) {
    let match = description.match(r);
    if (!match) {
      continue
    }
    let text = description.slice(match.index);
    const aIndex = text.match(/<a href=/).index;
    return text.slice(0, aIndex).replace("\n", ", ");
  }
}

const formatSlackMessage = (channel, item, tread) => {
  let { title, description, pubdate, link, evenName, skip, debugMsg } = item;
  title = title.replace(/[^a-z0-9 -]/gi, '');
  description = cleanUpDescription(description, skip, tread)
  const summary = `${description}${description ? "," : ""} Published: *${timeSince(new Date(pubdate))}*, Feed: *${evenName}*`
  return {
    channel,
    text: title,
    "thread_ts": tread,
    blocks: [
      {
        "type": "section",
        "block_id": "ITa",
        "text": {
          "type": "mrkdwn",
          "text": `

${skip ? debugMsg: ""}

<${link}|*${title}*>\n
${summary}
`,
          "verbatim": false
        }
      },
    ]
  }
}

module.exports = {
  formatSlackMessage
}


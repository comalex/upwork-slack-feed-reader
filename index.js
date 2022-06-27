require('dotenv-flow').config();
const RssFeedEmitter = require('rss-feed-emitter');
const {insertItem, checkIfExists, getAll} = require("./dbhelper");
const {filterItems} = require("./filters");
const {slackErrorMessage, sendSlackMsg} = require("./slackHelper");
const {formatSlackMessage} = require("./formatters");
const {DEBUG_CHANNEL, CHANNEL, DEBUG_MODE} = require("./config");


const slackMessageWithReply = async (slackChannel, item) => {
  const res = await sendSlackMsg(formatSlackMessage(slackChannel, item));
  let thread_ts = res?.data?.ts;
  if (thread_ts) {
    await sendSlackMsg(formatSlackMessage(slackChannel, item, thread_ts));
  }
}

const subscribe = async (evenName, item) => {
  console.debug("NEW FETCH...." + evenName);
  item = {evenName, ...item};
  try {
    const exists = await checkIfExists({
      title: item.title,
      pubdate: item.pubdate,
    })
    if (exists && !DEBUG_MODE) {
      console.debug("Already exists, skip");
      return
    }
    const { debugMsg, skip } = filterItems(item);

    item = {evenName, skip, ...item, debugMsg};

    if (!DEBUG_MODE) {
      await insertItem(item)
    } else {
      console.debug("DEBUG_MODE: not inserting to db");
    }

    const slackChannel = skip || DEBUG_MODE ? DEBUG_CHANNEL : CHANNEL;
    await slackMessageWithReply(slackChannel, item);

  } catch (e) {
    console.error(e);
    await slackErrorMessage(e);
  }
}


const feed = async () => {
  const feeder = new RssFeedEmitter();
  feeder.add({
    url: process.env.FEED1URL,
    refresh: 60000 * 2,
    skipFirstLoad: true,
    eventName: 'reactOnly' //React+Nextjs only
  });

  feeder.add({
    url: process.env.FEED2URL,
    refresh: 60000*3,
    skipFirstLoad: true,
    eventName: 'website' //Web/mobile country filtered
  });

  feeder.on('reactOnly', async function(item) {
    await subscribe("React+Nextjs only", item)
  })
  feeder.on('website', async function(item) {
    await subscribe("website/mobile", item)
  })
  feeder.on('error', (err) => {
    slackErrorMessage(err);
    console.log(err);
  });
}



const main = async () => {
  const msgExample = {
    "title": "Looking for App Development Agency Head to Consult with VC-backed Innovation Lab  - Upwork",
    "description": `Our venture-backed innovation lab is launching a number of new products including a mobile application built on React Native. We are looking for someone who has served in a leadership role developing in React. The developer who is leading this particular product needs 2 or less hours of time to consult the right candidate to find answers to the questions below.<br /><br />\nWe probably won&#039;t hire additional developers for about 2 months but helping us here would put you on an inside track to get that work when we do issue it. <br /><br />\nThe questions are: <br />\nWhat CI/CD tool(s) do you use? We have been working with microsoft app center which comes with a lot out of the box. However it seems pretty limited and I&#039;m not sure how well kept it is since the docs appear dated or even incomplete in places. I&#039;m considering using github actions.<br />\nWhat does your development cycle look like. Have you found that git or github flow have been a better fit for mobile development?<br />\nHave you found a mobile design system you like to work with? maybe a component library or even just a utility library like tailwind? I come from a material ui background but it doesn&#039;t look like the official google mui library will support react native going forward.<br />\nAs far as the back-end + db goes, did you find it easier to keep this in a separate codebase? What cloud service did you use to host it? I imagine that this was based off of how you hosted and distributed the front-end react app (e.g. if you used microsoft app-center for the mobile app, maybe you used azure for the db).<br /><br />\nAre you the one to help us? <br /><br />\nLooking forward to hearing from you. <br /><br /><b>Budget</b>: $200\n<br /><b>Posted On</b>: June 17, 2022 04:24 UTC<br /><b>Category</b>: Mobile App Development<br /><b>Skills</b>:React Native,     Native App Development,     iOS,     iPadOS,     tvOS,     watchOS,     Android,     Business with 1-9 Employees,     Business with 10-99 Employees,     GitHub    \n<br /><b>Country</b>: United States\n<br /><a href=\"https://www.upwork.com/jobs/Looking-for-App-Development-Agency-Head-Consult-with-backed-Innovation-Lab_%7E0108cf53ea6ff642eb?source=rss\">click to apply</a>`,
    "summary": `Our venture-backed innovation lab is launching a number of new products including a mobile application built on React Native. We are looking for someone who has served in a leadership role developing in React. The developer who is leading this particular product needs 2 or less hours of time to consult the right candidate to find answers to the questions below.<br /><br />\nWe probably won&#039;t hire additional developers for about 2 months but helping us here would put you on an inside track to get that work when we do issue it. <br /><br />\nThe questions are: <br />\nWhat CI/CD tool(s) do you use? We have been working with microsoft app center which comes with a lot out of the box. However it seems pretty limited and I&#039;m not sure how well kept it is since the docs appear dated or even incomplete in places. I&#039;m considering using github actions.<br />\nWhat does your development cycle look like. Have you found that git or github flow have been a better fit for mobile development?<br />\nHave you found a mobile design system you like to work with? maybe a component library or even just a utility library like tailwind? I come from a material ui background but it doesn&#039;t look like the official google mui library will support react native going forward.<br />\nAs far as the back-end + db goes, did you find it easier to keep this in a separate codebase? What cloud service did you use to host it? I imagine that this was based off of how you hosted and distributed the front-end react app (e.g. if you used microsoft app-center for the mobile app, maybe you used azure for the db).<br /><br />\nAre you the one to help us? <br /><br />\nLooking forward to hearing from you. <br /><br /><b>Budget</b>: $200\n<br /><b>Posted On</b>: June 17, 2022 04:24 UTC<br /><b>Category</b>: Mobile App Development<br /><b>Skills</b>:React Native,     Native App Development,     iOS,     iPadOS,     tvOS,     watchOS,     Android,     Business with 1-9 Employees,     Business with 10-99 Employees,     GitHub    \n<br /><b>Country</b>: United States\n<br /><a href=\"https://www.upwork.com/jobs/Looking-for-App-Development-Agency-Head-Consult-with-backed-Innovation-Lab_%7E0108cf53ea6ff642eb?source=rss\">click to apply</a>`,
    "date": "2022-06-17T04:24:45.000Z",
    "pubdate": "2022-06-17T04:24:45.000Z",
    "pubDate": "2022-06-17T04:24:45.000Z",
    "guid": "https://www.upwork.com/jobs/Looking-for-App-Development-Agency-Head-Consult-with-backed-Innovation-Lab_~0108cf53ea6ff642eb?source=rss",
    "link": "https://www.upwork.com/jobs/Looking-for-App-Development-Agency-Head-Consult-with-backed-Innovation-Lab_~0108cf53ea6ff642eb?source=rss",
  }

  getAll().then((msgs) => {
    msgs.forEach((msg) => {
      console.log(JSON.stringify(filterItems(msg)));
    })
  })
}

if (DEBUG_MODE) {
  console.log("RUNNING IN DEBUG MODE");
  main().catch((e) => {console.log(e);})
} else {
  console.log("RUNNING IN PRODUCTION MODE");
  feed().catch((e) => {slackErrorMessage(e); console.log(e);})

}



const {getBudget, getHourlyRange} = require("./parsers");
const {removeDuplicates} = require("./utils");

const COMMON = [
  "no agency", "no agencies", "NOT an agency",
  "2d game", "3d game", "game dev", "Game project",
  "fix bug", "immediately", "asap", "small fix",
  "individual contributor", "individual developer",
  "YOUR CAMERA",
  "tiktok",
  "raspberry",
  "india", "pakistan","INDONESIA",
  "join the team", "join our team",
  "teach me", "teach us",
  "data entry",
  "chrome extension",
]

const SKIP_LANGUAGES = [
  "Wordpress",  "php",  "ruby",  "drupal", "magento",
]
const STOP_TITLE_WORDS = [
  ...SKIP_LANGUAGES,
  "vuejs", "vue", "vue.js",
  "QA",
  "teach lead", "Lead Full Stack Developer", "Lead Developer", "Team lead", "Lead Full-Stack", "Lead Full-Stack",
  "Shopify" ,"WooCommerce",
  "Blockchain Engineer", "Blockchain developer",
  "Migrate", "simple", "quick",
  "animation",
  "electron",
  "today", "urgent",
  ...COMMON,
]

const STOP_WORDS = [
  "https://cutt.ly/6KuolQu",
  ...COMMON,
];

const STOP_AGGREGATE_WORDS = [
  ...SKIP_LANGUAGES,
  "today",  "urgent", "must", "have to",  "tracker",  "screenshot", "continue", "weekends",
  "video sharing", "screen sharing", "screen share", "video interview",
  "daily", "report",
  "Pacific timezone", "PST",
  "crashed",  "crash",
  "individual", "independent",
  "self-motivating", "worker",
  "willing", "small",
  "blockchain", "web3", "solidity", "DAO", "game",
  "growing team", "join our small team",
  "go to office", "visit office",
  "payment implementation",
  "senior", "security",
  ...COMMON,
]

const aggregateFilter = (msg) => {
  // return true if you want to skip item
  const res = removeDuplicates(STOP_AGGREGATE_WORDS).map((word) => {
     return [msg.title, msg.description].some((v) => v.toLowerCase().includes(word.toLowerCase()))
  })
  const TRASHHOLD = 3;
  if (res.filter((v) => v).length >= TRASHHOLD) {
    return true
  }
  return false;
}


const stopTitleWordsFilter = (msg) => {
  // return true if you want to skip item
  const res = STOP_TITLE_WORDS.some((word) => {
    return msg.title.toLowerCase().includes(word.toLowerCase())
  })
  return res;
}

const stopWordsFilter = (msg) => {
  // return true if you want to skip item
  const res = STOP_WORDS.some((word) => {
    return msg.description.toLowerCase().includes(word.toLowerCase())
  })
  return res;
}

const moneyBudgetFilter = (msg) => {
  // return true if you want to skip item
  const budget = getBudget(msg.description);
  if (!budget) {
    return false;
  }
  if (budget <= 600 && budget >= 10) {
    return true
  }
  return false
}

const moneyHourlyFilter = (msg) => {
  // return true if you want to skip item
  const data = getHourlyRange(msg.description);
  if (!data) {
    return false
  }
  const [start, end] = data;
  if (end >= 25) {
    return false;
  }
  return true
}

const filterItems = (msg) => {
  const filters = [stopWordsFilter, moneyBudgetFilter, moneyHourlyFilter, stopTitleWordsFilter, aggregateFilter]
  const res = filters.map((filter) => {
    const res = filter(msg);
    return {
      filterName: filter.name,
      status: res,
    }
  })

  return {
    skip: res.some((s) => s.status),
    debugMsg: res.map((s) => {
      let msg = `${s.filterName}: ${s.status}`
      if (s.status) msg = `*${msg}*` // make bold
      return msg
    }).join("; "),
  }
}

module.exports = {
  filterItems
}

const {getNumberFromCurrency} = require("./utils");


const getBudget = (text) => {
  try {
    const reg = /<b>Budget<\/b>:\s(\$?(:?\d+,?.?)+)/;
    let matches = (text.match(reg) || []).map(e => e.replace(reg, '$1'))
    return getNumberFromCurrency(matches[0]);
  }
  catch (e) {
    return null;
  }
}

const getHourlyRange = (text) => {
  try {
    const reg = /<b>Hourly Range<\/b>:\s(\$?(:?\d+,?.?)+)-(\$?(:?\d+,?.?)+)/;
    let matches = (text.match(reg) || []).map(e => e.replace(reg, '$1'))
    if (!matches[0]) {
      return null;
    }
    return [getNumberFromCurrency(matches[0]), getNumberFromCurrency(matches[3])];
  } catch (e) {
    return null
  }
}

module.exports = {
  getHourlyRange,
  getBudget,
}

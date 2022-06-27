
function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
function getNumberFromCurrency(currency) {
  return Number(currency.replace(/[$,]/g,''))
}

function findByTextContent(document, needle, haystack, precise) {
  // needle: String, the string to be found within the elements.
  // haystack: String, a selector to be passed to document.querySelectorAll(),
  //           NodeList, Array - to be iterated over within the function:
  // precise: Boolean, true - searches for that precise string, surrounded by
  //                          word-breaks,
  //                   false - searches for the string occurring anywhere
  var elems;

  // no haystack we quit here, to avoid having to search
  // the entire document:
  if (!haystack) {
    return false;
  }
    // if haystack is a string, we pass it to document.querySelectorAll(),
  // and turn the results into an Array:
  else if ('string' == typeof haystack) {
    elems = [].slice.call(document.querySelectorAll(haystack), 0);
  }
    // if haystack has a length property, we convert it to an Array
  // (if it's already an array, this is pointless, but not harmful):
  else if (haystack.length) {
    elems = [].slice.call(haystack, 0);
  }

  // work out whether we're looking at innerText (IE), or textContent
  // (in most other browsers)
  var textProp = 'textContent' in document ? 'textContent' : 'innerText',
    // creating a regex depending on whether we want a precise match, or not:
    reg = precise === true ? new RegExp('\\b' + needle + '\\b') : new RegExp(needle),
    // iterating over the elems array:
    found = elems.filter(function(el) {
      // returning the elements in which the text is, or includes,
      // the needle to be found:
      return reg.test(el[textProp]);
    });
  return found.length ? found : false;
}

const removeDuplicates = (arr) => {
  return arr.map((v) => v.toLowerCase()).filter(function (value, index, array) {
    return array.indexOf(value.toLowerCase()) === index;
  });
}

module.exports = {
  timeSince,
  removeDuplicates,
  findByTextContent,
  getNumberFromCurrency,
}

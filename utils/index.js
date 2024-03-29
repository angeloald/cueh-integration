const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

const stringifyDate = clickupDate => {
  const dateObj = clickupDate ? new Date(parseInt(clickupDate)) : new Date();
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  return `${year}-${month}-${day}`;
};

const convUser = clickupUser => {
  return (
    db
      .get("users")
      .find({ cuId: clickupUser })
      .value().ehId || null
  );
};

const convId = clickupId => {
  return `cl:${clickupId}`;
};

const convEstimate = clickupEstimate => {
  return clickupEstimate ? clickupEstimate / 1000 : this.defaultEstimate;
};

const convDate = clickupDate => {
  if (clickupDate) {
    const dateObj = new Date(parseInt(clickupDate));
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    return `${year}-${month}-${day}`;
  }
  return null;
};

function getPropSafe(fn, defaultVal = 0) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

function delay(seconds = process.env.STANDARD_DELAY || 3) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function poll(
  fn,
  clickupTaskId,
  retries = process.env.RETRIES || 5,
  pollGap = process.env.POLL_GAP || 3
) {
  return Promise.resolve()
    .then(fn)
    .catch(function retry(err) {
      if ("development" === process.env.NODE_ENV) {
        console.log(`Retries: ${retries}, gap is ${pollGap}: ${clickupTaskId}`);
      }
      if (retries-- > 0) {
        return delay(pollGap)
          .then(fn)
          .catch(retry);
      }
      throw err;
    });
}

module.exports = {
  stringifyDate,
  convUser,
  convId,
  convDate,
  convEstimate,
  getPropSafe,
  delay,
  poll
};

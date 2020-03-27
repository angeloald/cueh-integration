const fnMap = require("../everhour");
const Redis = require("ioredis");
const redis = new Redis();

const exists = clickupTaskId => {
  return redis.exists(clickupTaskId);
};

const enqueue = (clickupTaskId, fnName, fnData) => {
  const dataStr = JSON.stringify({ fnName: fnName, fnData: fnData });
  return redis
    .lpush(clickupTaskId, dataStr)
    .then(() => `enqueue ${fnName} ${clickupTaskId}`);
};

const dequeueExecute = async clickupTaskId => {
  const dataStr = await redis.rpop(clickupTaskId);
  if (dataStr) {
    const data = JSON.parse(dataStr);
    return fnMap[data.fnName](data.fnData);
  }
  return dataStr;
};

module.exports = { exists, enqueue, dequeueExecute };

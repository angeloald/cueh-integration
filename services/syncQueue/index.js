const { fnMap } = require("../everhour");
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
  try {
    const dataStr = await redis.rpop(clickupTaskId);
    if (dataStr) {
      const { fnName, fnData } = JSON.parse(dataStr);
      const fnRes = await fnMap(fnName)(fnData);
      console.log(fnRes);
    }
    return dataStr;
  } catch (err) {
    if (err.response) console.log(err.response.data);
    else console.log(err);
  }
};

const deleteQueue = clickupTaskId => {
  return redis.del(clickupTaskId);
};

module.exports = { exists, enqueue, dequeueExecute, deleteQueue };

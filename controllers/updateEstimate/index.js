const { fnMap } = require("../../services/everhour");
const { exists, enqueue } = require("../../services/syncQueue");
const { delay } = require("../../utils/");

module.exports = async (req, res) => {
  res.sendStatus(200);

  await delay(process.env.STANDARD_DELAY || 0);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupEstimate: req.body.history_items[0].after
  };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    console.log(`estimate enqueued ${fnData.clickupTaskId}`);
    await enqueue(fnData.clickupTaskId, "ESTIMATE", fnData);
    return;
  }

  const estimateFn = fnMap("ESTIMATE");
  const estimateRes = await estimateFn(fnData);
  console.log(estimateRes);
};

const { fnMap } = require("../../services/everhour");
const { exists, enqueue, dequeueExecute } = require("../../services/syncQueue");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupEstimate: req.body.history_items[0].after
  };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    await enqueue(fnData.clickupTaskId, "ESTIMATE", fnData);
    if ("development" === process.env.NODE_ENV) {
      await new Promise(r => setTimeout(r, 5000));
      await dequeueExecute(fnData.clickupTaskId);
    }
    return;
  }

  const estimateFn = fnMap("ESTIMATE");
  const estimateRes = await estimateFn(fnData);
  console.log(estimateRes);
};

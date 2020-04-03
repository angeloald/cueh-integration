const { fnMap } = require("../../services/everhour");
const { exists, enqueue } = require("../../services/syncQueue");
const { delay } = require("../../utils");

module.exports = async (req, res) => {
  res.sendStatus(200);

  await delay(process.env.STANDARD_DELAY || 2);

  const fnData = { clickupTaskId: req.body.task_id };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    await enqueue(fnData.clickupTaskId, "DELETE", fnData);
    return;
  }

  const deleteFn = fnMap("DELETE");
  const deleteRes = await deleteFn(fnData);
  console.log(deleteRes);
};

const { fnMap } = require("../../services/everhour");
const { exists, enqueue } = require("../../services/syncQueue");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupDueDate: req.body.history_items[0].after
  };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    await enqueue(fnData.clickupTaskId, "DUEDATE", fnData);
    if ("development" === process.env.NODE_ENV) {
      await new Promise(r => setTimeout(r, 5000));
      await dequeueExecute(fnData.clickupTaskId);
    }
    return;
  }

  const dueDateFn = fnMap("DUEDATE");
  const dueDateRes = await dueDateFn(fnData);
  console.log(dueDateRes);
};

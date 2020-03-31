const { fnMap } = require("../../services/everhour");
const { exists, enqueue } = require("../../services/syncQueue");
const { delay } = require("../../utils/");

module.exports = async (req, res) => {
  res.sendStatus(200);

  await delay(process.env.STANDARD_DELAY || 0);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupDueDate: req.body.history_items[0].after
  };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    await enqueue(fnData.clickupTaskId, "DUEDATE", fnData);
    return;
  }

  const dueDateFn = fnMap("DUEDATE");
  const dueDateRes = await dueDateFn(fnData);
  console.log(dueDateRes);
};

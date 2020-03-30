const { fnMap } = require("../../services/everhour");
const { exists, enqueue } = require("../../services/syncQueue");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupUsers: req.body.history_items.map(h => h.after.id)
  };

  const taskInQueue = await exists(fnData.clickupTaskId);
  if (taskInQueue) {
    await enqueue(fnData.clickupTaskId, "CREATE", fnData);
    return;
  }

  const updateAssigneeFn = fnMap("CREATE");
  const updateAssigneeRes = await updateAssigneeFn(fnData);
  console.log(updateAssigneeRes);
};

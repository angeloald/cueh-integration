const fnMap = require("../../services/everhour");
const { enqueueExecute } = require("../../services/syncQueue");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupUsers: req.body.history_items.map(h => h.after.id)
  };

  const updateAssigneeFn = fnMap("CREATE");
  const updateAssigneeRes = await updateAssigneeFn(fnData);
  console.log(updateAssigneeRes);
};

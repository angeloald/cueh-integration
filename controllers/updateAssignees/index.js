const fnMap = require("../../services/everhour");
const { enqueueExecute } = require("../../services/syncQueue");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const clickupTaskId = req.body.task_id;
  const clickupUsers = req.body.history_items.map(h => h.after.id);

  enqueueExecute(clickupTaskId, {
    action: "CREATE",
    clickupUsers: clickupUsers
  });
};

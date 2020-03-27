const fnMap = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = {
    clickupTaskId: req.body.task_id,
    clickupDueDate: req.body.history_items[0].after
  };

  const dueDateFn = fnMap("DUEDATE");
  const dueDateRes = await dueDateFn(fnData);
  console.log(dueDateRes);
};

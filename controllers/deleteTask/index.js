const fnMap = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);

  const fnData = { clickupTaskId: req.body.task_id };

  const deleteFn = fnMap("DELETE");
  const deleteRes = await deleteFn(fnData);
  console.log(deleteRes);
};

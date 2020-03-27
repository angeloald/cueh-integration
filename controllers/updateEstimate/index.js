const fnMap = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const clickupTaskId = req.body.task_id;
  const clickupEstimate = req.body.history_items[0].after;

  const estimateFn = fnMap("ESTIMATE");
  const estimateRes = await estimateFn(clickupTaskId, clickupEstimate);
  console.log(estimateRes);
};

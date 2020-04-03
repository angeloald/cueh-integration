// const { fnMap } = require("../../services/everhour");
// const { exists, enqueue } = require("../../services/syncQueue");
// const { delay } = require("../../utils/");

// module.exports = async (req, res) => {
//   res.sendStatus(200);

//   await delay(process.env.STANDARD_DELAY || 0);

//   const fnData = {
//     clickupTaskId: req.body.task_id,
//     clickupEstimate: req.body.history_items[0].after
//   };

//   const taskInQueue = await exists(fnData.clickupTaskId);
//   if (taskInQueue) {
//     console.log(`estimate enqueued ${fnData.clickupTaskId}`);
//     await enqueue(fnData.clickupTaskId, "ESTIMATE", fnData);
//     return;
//   }

//   const estimateFn = fnMap("ESTIMATE");
//   const estimateRes = await estimateFn(fnData);
//   console.log(estimateRes);
// };

const updateEstimate = require("./updateEstimate");
const updateDueDate = require("./updateDueDate");
const deleteTask = require("./deleteTask");
const updateAssignees = require("./updateAssignees");
const createTask = require("./createTask");

exports.routesCtl = async (req, res) => {
  try {
    const event = req.body.event;
    switch (event) {
      case "taskTimeEstimateUpdated":
        return updateEstimate(req, res);
      case "taskDueDateUpdated":
        return updateDueDate(req, res);
      case "taskDeleted":
        return deleteTask(req, res);
      case "taskAssigneeUpdated":
        return updateAssignees(req, res);
      case "taskCreated":
        return createTask(req, res);
      default:
        throw "Webhook event is not found";
    }
  } catch (err) {
    if (err.response) console.error(err.response.data);
    else console.error(err);
  }
};

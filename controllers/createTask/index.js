const {
  enqueue,
  dequeueExecute,
  deleteQueue,
} = require("../../services/syncQueue");
const {
  pollTaskSync,
  updateClickupChildTask,
  updateEverhourBillable,
} = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const fnData = {
    clickupTaskId: req.body.task_id,
  };

  try {
    console.log(`Locking ${fnData.clickupTaskId}`);
    await enqueue(fnData.clickupTaskId, "LOCKPOLL", fnData);
    const {
      list: { name: clickupTaskListName },
    } = await updateClickupChildTask(fnData.clickupTaskId);
    const pollStatus = await pollTaskSync(fnData).then((res) => res.status);
    await updateEverhourBillable(fnData.clickupTaskId, clickupTaskListName);

    if (pollStatus < 300) {
      let config = true;
      while (config) {
        await new Promise((r) => setTimeout(r, 2000));
        config = await dequeueExecute(fnData.clickupTaskId);
        if (config === null) break;
      }
      console.log(`Queue consumed ${fnData.clickupTaskId}`);
    }
  } catch (err) {
    await deleteQueue(fnData.clickupTaskId);
    console.log(`Poll failed ${fnData.clickupTaskId}`);
    if (err.response) console.log(err.response.data);
    else console.log(err);
  }
};

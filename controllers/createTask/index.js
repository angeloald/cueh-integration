const {
  enqueue,
  dequeueExecute,
  deleteQueue
} = require("../../services/syncQueue");
const {
  pollTaskSync,
  updateClickupChildTask
} = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const fnData = {
    clickupTaskId: req.body.task_id
  };

  try {
    console.log(`Locking ${fnData.clickupTaskId}`);
    await new Promise(r => setTimeout(r, 3000));
    await enqueue(fnData.clickupTaskId, "LOCKPOLL", fnData);
    await updateClickupChildTask(fnData.clickupTaskId);
    const pollStatus = await pollTaskSync(fnData).then(res => res.status);

    if (pollStatus < 300) {
      let config = true;
      while (config) {
        await new Promise(r => setTimeout(r, 2000));
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

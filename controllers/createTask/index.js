const { enqueue, dequeueExecute } = require("../../services/syncQueue");
const { pollTaskSync } = require("../../services/everhour");

module.exports = async (req, res) => {
  res.sendStatus(200);

  try {
    const fnData = {
      clickupTaskId: req.body.task_id
    };
    console.log(`Locking ${fnData.clickupTaskId}`);

    await enqueue(fnData.clickupTaskId, "LOCKPOLL", fnData);
    const pollStatus = await pollTaskSync(fnData).then(res => res.status);

    await new Promise(r => setTimeout(r, 3000));

    if (pollStatus < 300) {
      let config = dequeueExecute(fnData.clickupTaskId);
      while (config) {
        config = await dequeueExecute(fnData.clickupTaskId);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    console.log(`Queue consumed ${fnData.clickupTaskId}`);
  } catch (err) {
    if (err.response) console.log(err.response.data);
    else console.log(err);
  }
};

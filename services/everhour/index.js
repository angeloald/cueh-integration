const { tasks } = require("everhour-core");

const apiKey = process.env.EVERHOUR_API_KEY;

const deleteTask = async clickupTaskId => {
  const schedules = await tasks
    .getSchedule(apiKey, `cl:${clickupTaskId}`)
    .then(res => res.data);

  const promises = schedules.map(schedule =>
    tasks.deleteSchedule(apiKey, schedule.id)
  );

  return Promise.all(promises)
    .then(() => `Deleted schedules for ${clickupTaskId}`)
    .catch(() => {
      throw `Schedules deletion error --- ${clickupTaskId}`;
    });
};

const fnMap = key => {
  switch (key) {
    case "DELETE":
      return deleteTask;
    default:
      console.log("Invalid Key");
  }
};
module.exports = fnMap;

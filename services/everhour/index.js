const { tasks } = require("everhour-core");
const { stringifyDate, convUser, poll } = require("../../utils/index");

const clickup = require("clickup-core");

const apiKey = process.env.EVERHOUR_API_KEY;
const clickupApiKey = process.env.CLICKUP_API_KEY;

const deleteTask = async fnData => {
  const { clickupTaskId } = fnData;
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

const updateEstimate = async fnData => {
  const { clickupTaskId, clickupEstimate } = fnData;
  const schedules = await tasks
    .getSchedule(apiKey, `cl:${clickupTaskId}`)
    .then(res => res.data);

  const promises = schedules.map(schedule =>
    tasks.updateSchedule(apiKey, schedule.id, {
      time: (clickupEstimate || 900000) / 1000
    })
  );

  return Promise.all(promises)
    .then(() => `Updated estimates for ${clickupTaskId}`)
    .catch(() => {
      throw `Estimates update error --- ${clickupTaskId}`;
    });
};

const updateDueDate = async fnData => {
  const { clickupTaskId, clickupDueDate } = fnData;
  const schedules = await tasks
    .getSchedule(apiKey, `cl:${clickupTaskId}`)
    .then(res => res.data);

  const promises = schedules.map(schedule => {
    tasks.updateSchedule(apiKey, schedule.id, {
      startDate: stringifyDate(clickupDueDate),
      endDate: stringifyDate(clickupDueDate)
    });
  });

  return Promise.all(promises)
    .then(() => `Updated due dates for ${clickupTaskId}`)
    .catch(() => {
      throw `Due dates update error --- ${clickupTaskId}`;
    });
};

const createSchedule = async fnData => {
  const { clickupTaskId, clickupUsers } = fnData;
  const {
    parent,
    due_date,
    time_estimate,
    custom_fields,
    url,
    project
  } = await clickup.tasks
    .getTask(clickupApiKey, clickupTaskId)
    .then(res => res.data);

  const promises = clickupUsers.map(user => {
    const d = {
      task: `cl:${clickupTaskId}`,
      user: convUser(user),
      project: `cl:${project.id}`,
      startDate: stringifyDate(due_date),
      endDate: stringifyDate(due_date),
      time: (time_estimate || 900000) / 1000,
      note: url,
      includeWeekends: true,
      type: "task",
      forceOverride: true
    };
    return tasks.createSchedule(apiKey, d);
  });

  return Promise.all(promises)
    .then(() => `Created schedules for ${clickupTaskId}`)
    .catch(err => {
      throw err;
    });
};

const lockPollSentinelHead = async fnData => {
  return Promise.resolve(`Unlocking ${fnData.clickupTaskId}`);
};

const pollTaskSync = async fnData => {
  const { clickupTaskId } = fnData;
  console.log(`Polling for ${clickupTaskId}`);
  return poll(
    () => tasks.getTask(apiKey, `cl:${clickupTaskId}`),
    clickupTaskId
  );
};

const fnMap = key => {
  switch (key) {
    case "DELETE":
      return deleteTask;
    case "ESTIMATE":
      return updateEstimate;
    case "DUEDATE":
      return updateDueDate;
    case "CREATE":
      return createSchedule;
    case "LOCKPOLL":
      return lockPollSentinelHead;
    default:
      console.log("Invalid Key");
  }
};
module.exports = { fnMap, pollTaskSync };

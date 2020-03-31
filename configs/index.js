const { constructUserDictArray, createUserDatabase } = require("./userdb");
const {
  getWebhooksIds,
  deleteWebhooks,
  registerWebhooks
} = require("./webhooks");

(async () => {
  try {
    const userData = await constructUserDictArray();
    const userDataDbMsg = await createUserDatabase(userData);
    console.log(userDataDbMsg);

    const webhookIds = await getWebhooksIds();
    const deletedMsg = await deleteWebhooks(webhookIds);
    console.log(deletedMsg);

    const webhookConfigs = [
      {
        endpoint: "https://clickup-everhour.ngrok.io/webhooks/updateEstimate/",
        event: "taskTimeEstimateUpdated"
      },
      {
        endpoint: "https://clickup-everhour.ngrok.io/webhooks/deleteTask",
        event: "taskDeleted"
      },
      {
        endpoint: "https://clickup-everhour.ngrok.io/webhooks/updateDueDate",
        event: "taskDueDateUpdated"
      },
      {
        endpoint: "https://clickup-everhour.ngrok.io/webhooks/updateAssignees",
        event: "taskAssigneeUpdated"
      },
      {
        endpoint: "https://clickup-everhour.ngrok.io/webhooks/createTask",
        event: "taskCreated"
      }
    ];
    const registerMsg = await registerWebhooks(webhookConfigs);
    console.log(registerMsg);
  } catch (err) {
    if (err.response) console.log(err.response.data);
    else console.log(err);
  }
})();

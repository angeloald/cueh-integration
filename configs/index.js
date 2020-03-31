const {
  getWebhooksIds,
  deleteWebhooks,
  registerWebhooks
} = require("./webhooks");

(async () => {
  try {
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

// getWebhooksIds()
//   .then(res => res.data.webhooks)
//   .then(webhooks => webhooks.map(webhook => webhook.id))
//   .then(webhookIds => deleteWebhooks(webhookIds))
//   .then(() => console.log("Deleted all webhooks"))
//   .catch(err => {
//     if (err.response) console.log(err.response.data);
//     else console.log(err);
//   });

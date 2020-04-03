const { constructUserDictArray, createUserDatabase } = require("./userdb");
const {
  getWebhooksIds,
  deleteWebhooks,
  registerWebhooks
} = require("./webhooks");

(async () => {
  try {
    if ("development" !== process.env.NODE_ENV) {
      const userData = await constructUserDictArray();
      const userDataDbMsg = await createUserDatabase(userData);
      console.log(userDataDbMsg);
    }

    const webhookIds = await getWebhooksIds();
    const deletedMsg = await deleteWebhooks(webhookIds);
    console.log(deletedMsg);

    const webhooksConfig = {
      endpoint: "https://clickup-everhour.ngrok.io/webhooks/",
      events: [
        "taskTimeEstimateUpdated",
        "taskDeleted",
        "taskDueDateUpdated",
        "taskAssigneeUpdated",
        "taskCreated"
      ]
    };
    const registerMsg = await registerWebhooks(webhooksConfig);
    console.log(registerMsg);
  } catch (err) {
    if (err.response) console.log(err.response.data);
    else console.log(err);
  }
})();

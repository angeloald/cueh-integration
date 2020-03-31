const axios = require("axios");

const getWebhooksIds = async (
  teamId = process.env.CLICKUP_TEAM_ID,
  apiKey = process.env.CLICKUP_API_KEY
) => {
  const config = {
    method: "get",
    url: `https://api.clickup.com/api/v2/team/${teamId}/webhook`,
    headers: {
      authorization: apiKey
    }
  };
  const res = await axios(config);
  const webhooks = res.data.webhooks;
  const webhookIds = webhooks.map(webhook => webhook.id);
  return webhookIds;
};

const deleteWebhooks = async (
  webhookIds = [],
  apiKey = process.env.CLICKUP_API_KEY
) => {
  const config = {
    method: "delete",
    headers: {
      authorization: apiKey
    }
  };

  for (const webhookId of webhookIds) {
    config.url = `https://api.clickup.com/api/v2/webhook/${webhookId}`;
    await axios(config);
    await new Promise(r => setTimeout(r, 500));
  }

  return "No more webhooks";
};

const registerWebhooks = async (
  webhookConfigs = {},
  teamId = process.env.CLICKUP_TEAM_ID,
  apiKey = process.env.CLICKUP_API_KEY
) => {
  config = {
    method: "post",
    url: `https://api.clickup.com/api/v2/team/${teamId}/webhook`,
    headers: {
      authorization: apiKey
    },
    data: {}
  };

  const webhookAuth = {};
  for (const webhookConfig of webhookConfigs) {
    const { endpoint, event } = webhookConfig;
    config.data.endpoint = endpoint;
    config.data.events = [event];
    const webhookRes = await axios(config);
    const webhookData = webhookRes.data;
    const webhookId = webhookData.id;
    const webhookSecret = webhookData.webhook.secret;
    webhookAuth[webhookId] = webhookSecret;
    await new Promise(r => setTimeout(r, 500));
  }

  return webhookAuth;
};

module.exports = {
  getWebhooksIds,
  deleteWebhooks,
  registerWebhooks
};

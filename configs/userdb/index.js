const fs = require("fs");
const clickup = require("clickup-core");
const everhour = require("everhour-core");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const constructUserDictArray = async (
  clickupApiKey = process.env.CLICKUP_API_KEY,
  everhourApiKey = process.env.EVERHOUR_API_KEY,
  clickupTeamId = process.env.CLICKUP_TEAM_ID
) => {
  const cuUsers = await clickup.teams
    .getTeam(clickupApiKey)
    .then((res) => {
      const team = res.data.teams.find((team) => clickupTeamId === team.id);
      return team.members.map((u) => ({
        id: u.user.id,
        email: u.user.email,
      }));
    })
    .catch((err) => {
      if (err.response) {
        err.response.data["source"] = "clickup";
        err.response.data["status"] = err.response.status;
      }
      throw err;
    });

  const ehUsers = await everhour.users
    .getUsers(everhourApiKey)
    .then((res) => {
      return res.data.map((u) => ({ id: u.id, email: u.email }));
    })
    .catch((err) => {
      if (err.response) {
        err.response.data["source"] = "everhour";
        err.response.data["status"] = err.response.status;
      }
      throw err;
    });

  return Promise.all([cuUsers, ehUsers])
    .then((data) => {
      const userDictArray = [];
      const cuData = data[0];
      const ehData = data[1];

      cuData.forEach((user) => {
        let ehId = ehData.find((ehUser) => ehUser.email === user.email);
        if (ehId === undefined) {
          ehId = null;
        } else {
          ehId = ehId.id;
        }

        userDictArray.push({
          cuId: user.id,
          email: user.email,
          ehId: ehId,
        });
      });
      return userDictArray;
    })
    .catch((err) => {
      throw err;
    });
};

const createUserDatabase = (userData) => {
  if (fs.existsSync("./db.json")) {
    throw new Error("User database found. Please delete it to make a new one");
  } else {
    const adapter = new FileSync("db.json");
    const db = low(adapter);
    db.defaults({ users: [] }).write();
    userData.forEach((user) => {
      db.get("users").push(user).write();
    });
    return "New user database is created";
  }
};

module.exports = {
  constructUserDictArray,
  createUserDatabase,
};

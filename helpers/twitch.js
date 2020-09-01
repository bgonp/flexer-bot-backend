const fetch = require("node-fetch");

const TWITCH_API_URL = "https://api.twitch.tv/helix";

const fetchUser = async (username) => {
  const response = await fetch(`${TWITCH_API_URL}/users?login=${username}`, {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
    },
  });
  const body = await response.json();
  if (body.error) {
    throw new Error(body.message);
  }

  return body.data?.length > 0 ? body.data[0] : null;
};

module.exports = {
  fetchUser,
};

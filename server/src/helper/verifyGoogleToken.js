const { OAuth2Client } = require("google-auth-library");
const { clientId } = require("../secret");

const client = new OAuth2Client(clientId);

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    email_verified: payload.email_verified,
  };
};

module.exports = verifyGoogleToken;

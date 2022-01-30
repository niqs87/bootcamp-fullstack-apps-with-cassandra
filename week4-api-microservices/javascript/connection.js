// THIS FILE WILL BE OVERWRITTEN. DO NOT MAKE ANY CHANGES
const cassandra = require("cassandra-driver");

// This is the Zip file you downloaded
const SECURE_CONNECT_BUNDLE =
  "/workspace/bootcamp-fullstack-apps-with-cassandra/secure-connect-workshops.zip";
// This is the "Client Id" value you obtained earlier
const USERNAME = "FrPJbiHBGZRlOFeiknAYBqPL";
// This is the "Client Secret" value you obtained earlier
const PASSWORD = "PRdqQkiemM76D-dNTZeTwz5aU2s2slLlQkoUB3ADhkxbIMvz+pnI.+9MUiXbMXn3RylTjpFCvhIj8tMQDDFLY6i8C9KU4ol1..o3SxbXDAni5uRdA6BfMPFWcJrJYn_W";
// This is the keyspace name
const KEYSPACE = "todos";

const client = new cassandra.Client({
  cloud: { secureConnectBundle: SECURE_CONNECT_BUNDLE },
  keyspace: KEYSPACE,
  credentials: { username: USERNAME, password: PASSWORD },
});

process.on("exit", () => client.shutdown());

module.exports = {
  client,
};

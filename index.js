const express = require("express");
const winston = require("winston");
var cors = require("cors");
const app = express();
app.use(cors());
/* Start: load all custom modules at startup time */
require("./startup/routes.js")(app);
require("./startup/config.js")();
require("./startup/loggin.js")();
require("./startup/db.js")();
require("./startup/prod.js")(app);
/* End: load all custom modules at startup time */

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
  winston.info(`Server Listening on Port ${PORT}`);
});
module.exports = server;

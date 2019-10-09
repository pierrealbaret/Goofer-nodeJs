const crypto = require("crypto");

module.exports = createID = () => {
  "use strict";

  return crypto.randomBytes(16).toString("hex");
};

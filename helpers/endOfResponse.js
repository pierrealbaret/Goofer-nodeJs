module.exports = endOfResponse = (socket) => {
  "use strict";

  if (socket) {
    return socket.write("\r\n\r\n");
  }
};

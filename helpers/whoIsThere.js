// eslint-disable-next-line strict
module.exports = whoIsThere = (socket, players) => {
  return socket.emit("whoIsThere", players)
};
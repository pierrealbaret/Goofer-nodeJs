const
    isPlayerInGame = require("../helpers/isPlayerInGame"),
    handler = (parameters) => {
        const { games, socket } = parameters;
        if (isPlayerInGame(games, socket.id) === true) {
            currentGame = games.find(element => element.id === socket.gameId);
            delete currentGame.city.players[socket.id];
            socket.gameId = "";
            Object.values(currentGame.city.players)
                .map(player=>currentGame.city.print(player.id))
        }
    };

module.exports = {
    name: "leaveGame",
    description: "leave game",
    handler: handler,
};

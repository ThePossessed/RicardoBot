
function destroyConnection(connection, client) {
    client.currentChannelID = '';
    client.currentGuildID = '';
    client.adapterCreator = '';
    connection.destroy();
}

module.exports = { destroyConnection }
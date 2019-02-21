function onConnection(socket) {
    socket.on('/call/offer', function(args) {
        socket.emit('/call/answer', "Hello from offer, hahahahaha");
    });
}

module.exports = {
    onConnection: onConnection
}
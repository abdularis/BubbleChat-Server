const socketIdByPhone = new Map();
const phoneBySocketId = new Map();

function onConnection(io, socket) {
    socket.on('/signalling/send', function(data) {
        data = JSON.parse(data);

        const phone = data.address;
        const s = io.sockets.connected[socketIdByPhone[phone]];
        console.log("to " + data.address + ", cid: " + data.message.call_id);
        console.log("\tmsid " + socket.id);
        if (s) {
            console.log("\tsid " + s.id + ", phone " + phoneBySocketId[s.id]);
            data.address = phoneBySocketId[socket.id];
            s.emit('/signalling/receive', data);
        }
    });

    socket.on('/storePhoneNumber', function(data) {
        socketIdByPhone[data] = socket.id;
        phoneBySocketId[socket.id] = data;
        console.log("stored: " + data + ", " + socket.id);
    });
}

module.exports = {
    onConnection: onConnection
}
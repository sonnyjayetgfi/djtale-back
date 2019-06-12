const roomService = require('./Mongo/Services/RoomService');

const SocketServer = {

    roomInstances: [],

    getRoomInstance(roomId) {
        return SocketServer.roomInstances.filter(a => a._id == roomId)[0];
    },

    createRoomInstance(roomId, user, io) {
        roomService.getRoomById(roomId)
            .then((room) => {
                let roomInstance = {
                    ...room._doc,
                    data: {
                        users: [user],
                        chat : []
                    }
                }
                SocketServer.roomInstances.push(roomInstance);
                SocketServer.emitRoomInstanceToAll(roomId, roomInstance, io);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    updateRoomInstancePlaylist(roomId, instance, io) {
        SocketServer.roomInstances.forEach((roomInstance) => {
            if (roomInstance._id == roomId) {
                roomInstance.playlist = instance._doc.playlist;
                SocketServer.emitRoomInstanceToAll(roomId, roomInstance, io);
            }
        })
    },

    removeRoomInstanceUser(roomId, userId, io) {
        SocketServer.roomInstances.forEach((room) => {
            if (room._id == roomId) {
                room.data.users = room.data.users.filter(a => a._id != userId);
                SocketServer.emitRoomInstanceToAll(roomId, room, io);
            }
        })
    },

    addRoomInstanceUser(roomId, user, io) {
        SocketServer.roomInstances.forEach((roomInstance) => {
            if (roomInstance._id == roomId) {
                roomInstance.data.users = roomInstance.data.users.filter(a => a._id != user._id);
                roomInstance.data.users.push(user);
                SocketServer.emitRoomInstanceToAll(roomId, roomInstance, io);
            }
        });
    },

    emitRoomInstanceToAll(roomId, roomInstance, io) {
        io.sockets.in(roomId).emit(`room-${roomId}`, roomInstance);
    },

    addMessageInRoomChat(roomId, message, user, io) {
        let obj = {
            author : user.pseudo,
            datetime : Date.now(),
            message : message,
        };
        SocketServer.roomInstances.forEach((instance) => {
            if(instance._id == roomId) {
                instance.chat.push(obj);
                SocketServer.emitRoomInstanceToAll(roomId, instance, io);
            }
        })
    },


    init(http, io) {
        io.on('connection', (socket) => {

            socket.on('chatMessage', function(req) {
                const message = req.message;
                const roomId = req.roomId;
                const user = req.user;
                SocketServer.addMessageInRoomChat(roomId, message, user, io);
            });

            socket.on('addSong', function (req) {
                const { song } = req;
                const { roomId } = req;
                roomService.addSongToRoomPlaylist(roomId, song)
                    .then(() => {
                        roomService.getRoomById(roomId)
                            .then((room) => {
                                SocketServer.updateRoomInstancePlaylist(roomId, room, io);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            socket.on('leave', (req) => {
                let user = JSON.parse(req.user);
                socket.leaveAll();
                SocketServer.removeRoomInstanceUser(req.roomId, user._id, io);
            });

            socket.on('join', (req) => {
                let user = JSON.parse(req.user);
                socket.leaveAll();
                socket.join(req.roomId);
                if (SocketServer.roomInstances.filter(a => a._id.toString() === req.roomId.toString()).length === 0) {
                    SocketServer.createRoomInstance(req.roomId, user, io);                    
                } else {
                    SocketServer.addRoomInstanceUser(req.roomId, user, io);
                }
            });
        });

        http.listen(4444, '0.0.0.0');
    }
}
module.exports = SocketServer;

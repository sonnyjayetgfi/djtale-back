const roomService = require('./Mongo/Services/RoomService');
module.exports = {
    previousId: null,
    // safeJoin(currentId, socket) {
    //     console.log('leaving', this.previousId)
    //     socket.leave(this.previousId);        
    //     console.log('joining '+ currentId);
    //     socket.join(currentId);
    //     this.previousId = currentId;
    // },

    roomInstances: [],

    init(http, io) {
        io.on('connection', (socket) => {

            socket.on('disconnecting', function () {
                socket.leaveAll();
            });

            // join one room
            socket.on('join', (req) => {
                // this.safeJoin(req.roomId, socket);
                socket.leaveAll();
                socket.join(req.roomId);
                if (this.roomInstances.filter(a => a.id === req.roomId).length === 0) {
                    roomService.getRoomById(req.roomId)
                        .then((room) => {
                            let roomInstance = {
                                ...room._doc                               ,
                                data: {
                                    users: 1
                                }
                            }
                            this.roomInstances.push(roomInstance);
                            console.log("create and join : ", room.name);
                            io.sockets.in(req.roomId).emit(`room-${req.roomId}`, roomInstance);
                        })


                } else {
                    this.roomInstances.forEach((roomInstance) => {
                        if (roomInstance.id === req.roomId) {
                            roomInstance.data.users++;
                            console.log('join existing :', roomInstance.name);
                            io.sockets.in(req.roomId).emit(`room-${req.roomId}`, roomInstance);
                        }
                    });

                }
            });
        });
        http.listen(4444, '0.0.0.0');
    }
}

const Room = require('../Models/Room');
const PlaylistService = require('../Services/PlaylistServices');

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            Room.find({}, (err, rooms) => {
                if (err) {
                    reject(err);
                }
                const returned = rooms.map(room => {
                    return { _id: room._id, name: room.name, description: room.description, creatorName: room.creatorName }
                })
                resolve(returned);
            })
        })
    },

    createRoom: (room) => {
        return new Promise((resolve, reject) => {
            Room.create(room, (err, res) => {
                if (err) {
                    reject(err);
                }
                PlaylistService.createPlaylist({roomId: res._id}, 'default_playlist')
                .then((playlist) => {
                    res.playlist = playlist._id;
                    res.save((error,result) => {
                        if(error) {
                            reject(error);
                        }
                        resolve({res, playlist});
                    })
                    
                })
                .catch((error) => {
                    reject(error);
                })
                
            });
        })
    },

    getRoomById: (id) => {
        return new Promise((resolve, reject) => {
            Room.findOne({ _id: id }).populate('playlist').exec((err, room) => {
                if (err) {
                    reject(err)
                }
                resolve(room);
            })
        })
    }
};

const Room = require('../Models/Room');
const PlaylistService = require('../Services/PlaylistServices');
const Playlist = require('../Models/Playlist');
const Song = require('../Models/Song');

const RoomService = {

    getAllRoomsWithCurrentSong: () => {
        return new Promise((resolve, reject) => {

        })
    },

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
                PlaylistService.createPlaylist({ roomId: res._id }, 'default_playlist')
                    .then((playlist) => {
                        res.playlist = playlist._id;
                        res.save((error, result) => {
                            if (error) {
                                reject(error);
                            }
                            resolve({ res, playlist });
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
                Playlist.populate(room, {
                    'path': "playlist.songs",
                    select: 'name',
                    model: Song
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result)
                })
            })
        })
    },

    addSongToRoomPlaylist: (roomId, song) => {
        return new Promise((resolve, reject) => {
            RoomService.getRoomById(roomId)
                .then((room) => {
                    PlaylistService.addSongToPlayList(song, room.playlist._id)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((error) => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }
};

module.exports = RoomService;

const Playlist = require('../Models/Playlist');
const Song = require('../Models/Song');
const PlaylistService = {};

PlaylistService.getPlaylistByCriterias = (criterias) => {
  return new Promise((resolve, reject) => {
    Playlist.find(criterias).populate('songs').exec((err, playlistList) => {
      if (err) {
        reject(err);
      }
      resolve(playlistList);
    });
  });
};

PlaylistService.addSongToPlayList = (userId, form, playlistId) => {
  return new Promise((resolve, reject) => {
    PlaylistService.getPlaylistByCriterias({ _id: playlistId, userId: userId })
      .then((playlistList) => {
        if (!playlistList.length) {
          reject('No playlist');
        }
        const playlist = playlistList[0];
        if (playlist.songs.filter(a => a.url === form.url).length == 1) {
          reject('This song is already in this playlist ! ');
        } else {
          const song = {
            name: form.name,
            url: form.url,
            priority: playlist.songs.length,
            playlistId: playlist._id,
          };
          Song.create(song, (err, res) => {
            if (err) {
              reject(err);
            }
            playlist.songs.push(res._id);
            playlist.save((err2, res2) => {
              if (err2) {
                reject(err2);
              }
              resolve(res2);
            });
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  })


}

PlaylistService.createPlaylist = (userId, playlistName) => {
  return new Promise((resolve, reject) => {
    PlaylistService.getPlaylistByCriterias({ userId })
      .then(async (response) => {
        const nameUsed = await response.filter(a => a.name === playlistName).length > 0 ? true : false;
        if (nameUsed) {
          reject('Playlist name already used ! ');
        } else {
          Playlist.create({
            name: playlistName,
            userId: userId,
            playlistByDefault: response.length > 0 ? false : true,
          }, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

PlaylistService.setDefaultPlaylist = (userId, playlistId) => {
  return new Promise((resolve, reject) => {

    PlaylistService.getPlaylistByCriterias({ userId })
      .then((response) => {
        if (response == []) {
          reject('No playlist');
        }
        // let playlist = response[0];
        response.forEach((playlist) => {
          playlist.playlistByDefault = playlist._id == playlistId ? true : false;
          playlist.save((err, res) => {
            if (err) {
              reject(err);
            }
            if (playlist == response[response.length - 1]) {
              resolve(response);
            }
          });
        })

      })
      .catch((error) => {
        reject(error);
      });
  });
};

PlaylistService.updateSongPriority = (userId, playlistId, songId, direction) => {
  return new Promise((resolve, reject) => {
    PlaylistService.getPlaylistByCriterias({ userId, playlistId })
      .then((playlistList) => {
        if (playlistList.length == 0) {
          reject('No playlist');
        }
        let playList = playlistList[0];
        let songs = playList.songs;
        let targetSong = songs.filter(a => a._id == songId);
        if (direction == -1 || direction == 1) {
          let switchedSong = songs.filter(a => a.priority == targetSong.priority + direction);
          switchedSong.priority += 1;
          targetSong.priority -= 1;
          async.parallel([targetSong.save, switchedSong.save], (err, responses) => {
            if (err) {
              reject(err);
            }
            resolve(responses);
          });
        } else if (direction == 'start') {
          songs.forEach((song) => {
            if (song.priority < targetSong.priority) {
              song.priority += 1;
            }
            if (song._id == targetSong._id) {
              song.priority = 0;
            }
          });
          songs.save((err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res);
          });
        } else {
          reject('Invalid direction');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};


module.exports = PlaylistService;
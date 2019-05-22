const express = require('express');
const router = express.Router();
const PlaylistService = require('../Mongo/Services/PlaylistServices');

router.get('/getPlaylistsByUser', (req, res) => {
  const { userId } = req.query;
  PlaylistService.getPlaylistByCriterias({ userId })
    .then((response) => {
      return res.status(200).json({
        codeMessage: 'GetPlaylistSuccess',
        statusCode: 200,
        data: response,
      });
    })
    .catch((error) => {
      return res.status(500).json(error);
    })
});


router.post('/addSongToPlayList', (req, res) => {
  const form = {
    name: req.body.name,
    url: req.body.url,
    userId: req.body.userId,
    playlistId: req.body.playlistId,
  }
  PlaylistService.addSongToPlayList(form.userId, form, form.playlistId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(400).json(error);
    })
});


router.post('/createPlaylist', (req, res) => {
  const form = {
    playlistName: req.body.playlistName,
    userId: req.body.userId,
  };
  PlaylistService.createPlaylist(form.userId, form.playlistName)
    .then((response) => {
      return res.status(200).json({
        codeMessage: 'CreatePlaylistSuccess',
        statusCode: 200,
        data: response
      });
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});


router.get('/setDefaultPlaylist', (req, res) => {
  if (!req.query.playlistId || !req.query.userId) {
    return res.status(400).json({
      codeMessage: 'SetDefaultPlaylistInvalidInformation',
      statusCode: 400,
    });
  }
  const form = {
    userId: req.query.userId,
    playlistId: req.query.playlistId,
  };
  PlaylistService.setDefaultPlaylist(form.userId, form.playlistId)
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(500).json(error);
    })
})

router.post('/updateSongsPriority', (req, res) => {
  const { userId } = req.body;
  const { playlistId } = req.body;
  const { songId } = req.body;
  const { newPriority } = req.body;
  PlaylistService.updateSongPriority(userId, playlistId, songId, newPriority)
    .then((response) => {
      PlaylistService.getPlaylistByCriterias({userId})
        .then((p) => {
          return res.status(200).json({
            codeMessage: 'UpdateSongPrioritySuccess',
            statusCode: 200,
            data: p,
          });
        })
        .catch((error) => {          
          return res.status(400).json(error);
        })
      
    })
    .catch((error) => {
      console.log(error)
      return res.status(400).json(error);
    })
})


module.exports = router;
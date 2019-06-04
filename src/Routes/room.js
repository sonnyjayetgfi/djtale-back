const express = require('express');
const router = express.Router();
const RoomService = require('../Mongo/Services/RoomService');

router.use('/getAll', (req, res) => {
    RoomService.getAll()
    .then((rooms) => {
        res.status(200).json({
            codeMessage : 'GetRoomsSuccess',
            statusCode: 200,
            data: rooms
        });
    })
    .catch((error) => {
        res.status(500).json({
            codeMessage: 'GetRoomsError',
            error: error,
            statusCode: 500
        });
    });
});


router.post('/create', (req, res) => {
    const room = {
        name : req.body.name,
        description : req.body.description,
        creatorName : req.user.pseudo,
        people : 0,
    }
    RoomService.createRoom(room)
    .then((response) => {
        res.status(200).json({
            codeMessage: 'CreateRoomSuccess',
            statusCode: 200,
            data : response,
        });
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            error: JSON.parse(error),
            codeMessage: 'CreateRoomError',
            statusCode: 500,
        });
    });
});

router.get('/getById', (req,res) => {
    const { roomId } = req.query;
    RoomService.getRoomById(roomId)
    .then((room) => {
        if(room === null){
            return res.status(404).json({
                codeMessage: 'GetRoomNotFound',
                statusCode: 404,
            });
        }
        return res.status(200).json({
            codeMessage: 'GetRoomSuccess',
            data: room,
            statusCode: 200,
        });
    })
    .catch((error) => {
        return res.status(500).json({
            codeMessage: 'GetRoomError',
            error: error,
            statusCode: 500
        });
    });
});


router.post('/addSongToCurrentPlaylist', (req, res) => {
    
})
module.exports = router;

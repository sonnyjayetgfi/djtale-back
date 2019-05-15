// const http = require('http');
// const io = require('socket.io')(http);
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const configuration = require('./configuration');
const httpServer = require('./httpServer');

// routes
const authRoutes = require('./Routes/auth');
const playlistRoutes = require('./Routes/playlist');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
// limit 5Mb for reprt creation. Adapt depending on max report size
app.use(bodyParser.urlencoded({ extended: 'true', limit: '5mb' }));
app.use(cors({ exposedHeaders: ['new-token'] }));

// Mongo Start
mongoose.Promise = global.Promise;
const envOption = process.argv[2] || 'default';
const envConfiguration = configuration.serverStart[envOption] || configuration.serverStart.default;
mongoose.connect(envConfiguration.mongoServer.ip)
  .then((res) => {
    console.log(`connection successful on database :  ${res.connection.name}`);
  })
  .catch(err => console.error(err));

// Http Server
httpServer.start(app, envConfiguration);
app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);
// app.use('/', (req, res) => {
//   console.log(req.body);
//   res.status(200).send('Sonny');
// })

// Socket Server



// const documents = {}

// io.on("connection", socket => {
//   console.log(socket);
//   let previousId;
//   const safeJoin = currentId => {
//     socket.leave(previousId);
//     socket.join(currentId);
//     previousId = currentId;
//   };

//   socket.on("getDoc", docId => {
//     console.log(`trying to get doc ${docId}`);
//     safeJoin(docId);
//     socket.emit("document", documents[docId]);
//   });

//   socket.on("addDoc", doc => {
//     documents[doc.id] = doc;
//     safeJoin(doc.id);
//     io.emit("documents", Object.keys(documents));
//     socket.emit("document", doc);
//     console.log(`doc added : ${doc.title}`);
//   });

//   socket.on("editDoc", doc => {
//     console.log(`editing doc ${doc.title}`);
//     documents[doc.id] = doc;
//     socket.to(doc.id).emit("document", doc);
//   });

//   io.emit("documents", Object.keys(documents));
// });


// http.listen(4444);
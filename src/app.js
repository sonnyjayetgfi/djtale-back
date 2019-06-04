const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const configuration = require('./configuration');
const httpServer = require('./httpServer');
const jsonWebToken = require('./Services/jsonwebtoken');
const userService = require('./Mongo/Services/UserService');
// routes
const authRoutes = require('./Routes/auth');
const playlistRoutes = require('./Routes/playlist');
const userRoutes = require('./Routes/user');
const roomRoutes = require('./Routes/room');
const app = express();
const socketServer = require('./socketServer');
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

// JWT Check
app.use('/', (req, res, next) => {
  if(req.path === '/auth/login' || req.path === '/auth/register'){
    return next();
  } else {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const jwt = req.headers.authorization.split(' ')[1];
      const decodedToken = jsonWebToken.decodeToken(jwt);    
      userService.getUserByCriterias({identity: decodedToken.userId})
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) =>{
        return res.status(500).json({
          codeMessage : 'InternalError',
          statusCode : 500,
          error: error
        });
      })
    } else {
      return res.status(403).json({
        codeMessage : 'UnauthorizedRequestInvalidToken',
        statusCode : 403
      });
    }   
  }
})
app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);
app.use('/user', userRoutes);
app.use('/room', roomRoutes);


const http = require('http').Server(app);
const io = require('socket.io')(http);
socketServer.init(http, io);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const authRouter = require('../auth/auth-router.js');
// const usersRouter = require('../users/users-router.js');
const sessionConfig = require('../auth/session-config.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api', authRouter);
// server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("Hello.");
});

module.exports = server;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const comments = require('./routes/api/comments');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const app = express();
const corsOptions = {
    origin: '*',
    credentials: true };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {useNewUrlParser: true}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
app.use(passport.initialize());

require('./config/passport')(passport);
app.use('/api/users',users);
app.use('/api/posts',posts);
app.use('/api/comments', comments);
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  });
}
const port = process.env.PORT | 9000;

const server = app.listen(port);

let io = module.exports.io = require('socket.io').listen(server);

const SocketManager = require('./SocketManager')
io.on('connection', SocketManager);

require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('Connected to the db'));

app.use(express.json());

const announcementsRouter = require('./routes/announcements');
app.use('/announcements',announcementsRouter);

//import
const usersRouter = require('./routes/users');
app.use('/users',usersRouter);

app.listen(3000, () => console.log("Server started ! "));
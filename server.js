require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs')


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('Connected to the db'));

app.use(express.json());

app.get('/home', (req,res)=>{
    res.render('index')
})

//import announcements routes
const announcementsRouter = require('./routes/announcements');
app.use('/announcements',announcementsRouter);

//import user routes
const usersRouter = require('./routes/users');
app.use('/users',usersRouter);

app.listen(3000, () => console.log("Server started ! "));
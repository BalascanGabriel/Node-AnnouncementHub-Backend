require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.static('public'))

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('Connected to the db'));

app.use(express.json());

app.get('/', (req,res)=>{
    res.render('index')
})


//import announcements routes
const announcementsRouter = require('./routes/announcements');
app.use('/api/announcements',announcementsRouter);

//import user routes
const usersRouter = require('./routes/users');
app.use('/api/users',usersRouter);

//import favorites
const favoritesRouter = require('./routes/favorites');
app.use('/api/favorites',favoritesRouter);


app.listen(3000, () => console.log("Server started ! "));
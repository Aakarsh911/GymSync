const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.post('/register', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Successfully registered");
        }
    });
});
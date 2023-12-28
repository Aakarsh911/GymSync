const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const ejs = require('ejs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/registeration');

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

const PORT = 3001;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log("here");
app.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists. Please login.' });
        }
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== req.body.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Successful login
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  

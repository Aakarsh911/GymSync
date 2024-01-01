const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/registeration'); // Replace with your MongoDB connection string

const db = mongoose.connection;

const workoutSchema = new mongoose.Schema({
    workoutName: String,
    days: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    },
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    workouts: [workoutSchema],
});

const User = mongoose.model('User', userSchema);

const PORT = 3001;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists. Please login.' });
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            workouts: [],
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
        res.json({ message: 'Login successful', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/addWorkout', async (req, res) => {
    try {
        const { username, workoutName } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new workout object with the specified workout name and days
        const newWorkout = {
            workoutName,
            days: {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: [],
            },
        };

        // Push the new workout object to the workouts array
        user.workouts.push(newWorkout);

        // Save the updated user
        await user.save();

        res.json({ message: 'Workout added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/deleteWorkout', async (req, res) => {
    try {
        const { username, workoutIndex } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the workout at the specified index
        user.workouts.splice(workoutIndex, 1);

        // Save the updated user
        await user.save();

        res.json({ message: 'Workout deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getWorkouts/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ workouts: user.workouts });
    } catch (error) {
        console.error("Error fetching workouts:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/updateWorkoutName', async (req, res) => {
    try {
        const { username, workoutIndex, newName } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.workouts[workoutIndex].workoutName = newName;

        await user.save();

        res.json({ message: 'Workout name updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/addExercise', async (req, res) => {
    try {
        const { username, workoutIndex, day, exercise } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the workout by index
        const workout = user.workouts[workoutIndex];

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Add the exercise to the specified day
        workout.days[day].push(exercise);

        // Save the updated user
        await user.save();

        res.json({ message: 'Exercise added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getExercises/:username/:workoutIndex/:day', async (req, res) => {
    try {
      const { username, workoutIndex, day } = req.params;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const workout = user.workouts[workoutIndex];
  
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      const exercises = workout.days[day] || [];
  
      res.json({ exercises });
    } catch (error) {
      console.error("Error fetching exercises:", error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/deleteExercise', async (req, res) => {
    try {
        const { username, workoutIndex, day, exerciseIndex } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const workout = user.workouts[workoutIndex];

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        workout.days[day].splice(exerciseIndex, 1);

        await user.save();

        res.json({ message: 'Exercise deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/updateExercise', async (req, res) => {
    try {
        const { username, workoutIndex, day, exerciseIndex, updatedExercise } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const workout = user.workouts[workoutIndex];

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        workout.days[day][exerciseIndex] = updatedExercise;

        await user.save();

        res.json({ message: 'Exercise updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
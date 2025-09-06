# GymSync 💪

A collaborative fitness workout planning and tracking application that helps users create, manage, and share personalized workout routines.

## 🌟 What is GymSync?

GymSync is a full-stack web application designed to simplify workout planning and enable fitness enthusiasts to collaborate by sharing their workout routines. Whether you're a beginner looking for structured workout plans or an experienced fitness enthusiast wanting to share your expertise, GymSync provides the tools you need to organize your fitness journey.

### Key Features

- **🔐 User Authentication**: Secure registration and login system with email validation
- **📅 Workout Management**: Create, edit, and delete personalized workout routines
- **🗓️ Day-based Planning**: Organize exercises by day of the week (Monday through Sunday)
- **🤝 Workout Sharing**: Share your workout routines with other users in the community
- **📊 Personal Dashboard**: Centralized view of all your workouts and shared content
- **✏️ Exercise Tracking**: Add, edit, and remove individual exercises within workouts
- **🔄 Import Shared Workouts**: Add shared workouts from others to your personal collection

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI library for building interactive interfaces
- **React Router DOM** - Client-side routing and navigation
- **FontAwesome Icons** - Professional iconography
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **CORS** - Cross-origin resource sharing middleware

## 🚀 Getting Started

### Prerequisites

Before running GymSync, ensure you have the following installed:
- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aakarsh911/GymSync.git
   cd GymSync
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   The backend is pre-configured to connect to a MongoDB Atlas database. For production use, you should:
   - Create your own MongoDB Atlas account
   - Replace the connection string in `backend/server.js` with your own database URL
   - Use environment variables to store sensitive configuration

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will start on `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The React app will start on `http://localhost:3000`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📱 How to Use GymSync

### Getting Started
1. **Register**: Create a new account with your username, email, and secure password
2. **Login**: Access your personal dashboard using your credentials

### Managing Workouts
1. **Create a Workout**: Click the "+" button to add a new workout routine
2. **Name Your Workout**: Give your workout a descriptive name
3. **Add Exercises**: Select a day of the week and add exercises with details like:
   - Exercise name
   - Sets and reps
   - Duration or weight
   - Special notes

### Organizing Your Week
- **Day Selection**: Use the dropdown menu to switch between days (Monday-Sunday)
- **Exercise Management**: Edit or delete individual exercises as needed
- **Workout Overview**: View all your workouts in the sidebar

### Sharing and Collaboration
1. **Share Workouts**: Use the share button to make your workouts available to other users
2. **Browse Shared Workouts**: Discover routines shared by the community
3. **Import Workouts**: Add interesting shared workouts to your personal collection
4. **Customize**: Modify imported workouts to fit your specific needs

## 🔌 API Endpoints

The backend provides a RESTful API with the following main endpoints:

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication

### Workout Management
- `GET /getWorkouts/:username` - Fetch user's personal workouts
- `POST /addWorkout` - Create a new workout
- `POST /deleteWorkout` - Remove a workout
- `POST /editWorkout` - Update workout details

### Exercise Management
- `GET /getExercises/:username/:workoutIndex/:day` - Get exercises for a specific day
- `POST /addExercise` - Add an exercise to a workout day
- `POST /deleteExercise` - Remove an exercise
- `POST /editExercise` - Update exercise details

### Sharing Features
- `GET /getSharedWorkouts/:username` - Fetch shared workouts
- `POST /shareWorkout` - Share a workout with the community
- `POST /moveToWorkouts/:username/:workoutIndex` - Import shared workout to personal collection

## 🤝 Contributing

We welcome contributions to make GymSync even better! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm start        # Start development server
npm run build    # Create production build
npm test         # Run tests
```

### Backend Development
```bash
cd backend
npm start        # Start server with nodemon (auto-reload)
```

## 📋 Project Structure

```
GymSync/
├── frontend/              # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── validation/   # Form validation logic
│   │   └── styles/       # CSS styling
├── backend/              # Node.js/Express backend
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
└── README.md            # Project documentation
```

## 🛠️ Future Enhancements

- **Progress Tracking**: Add charts and statistics for workout progress
- **Social Features**: Follow other users and create workout communities
- **Mobile App**: Native mobile applications for iOS and Android
- **Exercise Database**: Comprehensive exercise library with instructions and videos
- **Workout Templates**: Pre-built workout templates for different fitness goals
- **Nutrition Tracking**: Integrate meal planning and calorie tracking
- **Wearable Integration**: Connect with fitness trackers and smartwatches

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aakarsh Kaushal**
- GitHub: [@Aakarsh911](https://github.com/Aakarsh911)

## 🙏 Acknowledgments

- Thanks to the open-source community for providing excellent tools and libraries
- Inspired by the need for collaborative fitness planning tools
- Built with passion for helping people achieve their fitness goals

---

**Ready to sync your fitness journey? Get started with GymSync today!** 🚀💪
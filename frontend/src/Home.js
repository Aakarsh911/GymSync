import React, { useState, useEffect } from "react";
import userLogo from "./user.png";

function Home() {
  const username = localStorage.getItem("username");
  const [showForm, setShowForm] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [hoveredWorkoutIndex, setHoveredWorkoutIndex] = useState(null);

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/getWorkouts/${username}`);
        if (response.ok) {
          const data = await response.json();
          // Extract only the workout names from the fetched data
          setUserWorkouts(data.workouts || []);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error.message);
        // Handle error as needed
      }
    };

    fetchUserWorkouts();
  }, [username]);

  const addWorkout = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3001/addWorkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          workoutName: workoutName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUserWorkouts([...userWorkouts, { workoutName }]);
      setWorkoutName("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding workout:", error.message);
      // Handle error as needed
    }
  };

  const handleDelete = async (index) => {
    try {
      const response = await fetch("http://localhost:3001/deleteWorkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          workoutIndex: index,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedWorkouts = [...userWorkouts];
      updatedWorkouts.splice(index, 1);
      setUserWorkouts(updatedWorkouts);
    } catch (error) {
      console.error("Error deleting workout:", error.message);
      // Handle error as needed
    }
  };

  return (
    <div className="container">
      <div className="day-panel">
        <h1>Workouts</h1>
        <h3 className="add" onClick={addWorkout}>
          Add a new workout schedule <span className="add-button">+</span>
        </h3>
        {showForm && (
          <div className="workout-form">
            <input
              type="text"
              placeholder="Enter workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
        {userWorkouts.map((workout, index) => (
          <div
            key={index}
            className={`workout-item ${hoveredWorkoutIndex === index ? "hovered" : ""}`}
            onMouseEnter={() => setHoveredWorkoutIndex(index)}
            onMouseLeave={() => setHoveredWorkoutIndex(null)}
          >
            <h2>{workout.workoutName}</h2>
            {hoveredWorkoutIndex === index && (
              <span className="delete-icon" onClick={() => handleDelete(index)}>
                🗑️
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="dashboard">
        <div className="dashboard-nav">
          <h1>{username}'s Dashboard</h1>
          <div className="account">
            <img src={userLogo} alt="user" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

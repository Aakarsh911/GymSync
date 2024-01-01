import React, { useState, useEffect } from "react";
import userLogo from "./user.png";
import { useNavigate } from "react-router-dom";

function Home() {
    const username = localStorage.getItem("username");
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [editWorkoutName, setEditWorkoutName] = useState("");
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [hoveredWorkoutIndex, setHoveredWorkoutIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [showDropdown, setShowDropdown] = useState(false);

    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [numberOfSets, setNumberOfSets] = useState("");
    const [numberOfRepetitions, setNumberOfRepetitions] = useState("");
    const [exerciseTime, setExerciseTime] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");
    const [exercises, setExercises] = useState([]);
    const [editExerciseIndex, setEditExerciseIndex] = useState(null);
    const [editedExerciseName, setEditedExerciseName] = useState("");
    const [editedNumberOfSets, setEditedNumberOfSets] = useState("");
    const [editedNumberOfRepetitions, setEditedNumberOfRepetitions] = useState("");
    const [editedExerciseTime, setEditedExerciseTime] = useState("");
    const [editedExerciseWeight, setEditedExerciseWeight] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate("/login");
        }
        const fetchUserWorkouts = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getWorkouts/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserWorkouts(data.workouts || []);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching workouts:", error.message);
            }
        };
        fetchUserWorkouts();
    }, [username]);

    useEffect(() => {
        const fetchUserExercises = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getExercises/${username}/${selectedWorkoutIndex}/${selectedDay}`);
                if (response.ok) {
                    const data = await response.json();
                    setExercises(data.exercises || []);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching exercises:", error.message);
                setExercises([]);
            }
        };
        fetchUserExercises();
    }, [username, selectedWorkoutIndex, selectedDay]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const selectDay = (day) => {
        setSelectedDay(day);
        setShowDropdown(false);
    };

    const addWorkout = () => {
        setShowForm(true);
    };

    const Logout = () => {
        localStorage.removeItem("username");
        navigate("/login");
    };

    const handleCreateSubmit = async () => {
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
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch("http://localhost:3001/updateWorkoutName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: editIndex,
                    newName: editWorkoutName,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedWorkouts = [...userWorkouts];
            updatedWorkouts[editIndex].workoutName = editWorkoutName;
            setUserWorkouts(updatedWorkouts);

            setEditWorkoutName("");
            setEditIndex(null);
            setShowEditForm(false);
        } catch (error) {
            console.error("Error updating workout name:", error.message);
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

            if (editIndex === index) {
                setShowEditForm(false);
                setEditIndex(null);
                setEditWorkoutName("");
            }

            // Reset selected workout index and exercises when the current workout is deleted
            if (selectedWorkoutIndex === index) {
                setSelectedWorkoutIndex(0); // Set to the first workout or another default index
                const updatedExercises = await fetchUpdatedExercises();
                setExercises(updatedExercises);
            }
        } catch (error) {
            console.error("Error deleting workout:", error.message);
        }
    };

    const handleEdit = async (index) => {
        setEditIndex(index);
        setEditWorkoutName(userWorkouts[index].workoutName);
        setShowEditForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setShowEditForm(false);
        setWorkoutName("");
        setEditWorkoutName("");
        setEditIndex(null);
    };

    const selectWorkout = (index) => {
        setSelectedWorkoutIndex(index);
    };

    const displayExerciseForm = () => {
        setShowExerciseForm(true);
    };

    const displayBackAndSet = () => {
        setEditExerciseIndex(null);
        const allExercises = document.querySelectorAll(".exercise");
            allExercises.forEach(exercise => {
                exercise.classList.remove("hidden");
            });
    }

    const handleExerciseSubmit = async () => {
        try {
            // Validate exercise name before submitting
            if (!exerciseName) {
                // Show error message using the error class
                console.error("Exercise name is required.");
                return;
            }

            const response = await fetch("http://localhost:3001/addExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exercise: {
                        name: exerciseName || "N/A",
                        sets: numberOfSets || "N/A",
                        repetitions: numberOfRepetitions || "N/A",
                        time: exerciseTime || "N/A",
                        weight: exerciseWeight || "N/A",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);

            // Reset the exercise form state
            setExerciseName("");
            setNumberOfSets("");
            setNumberOfRepetitions("");
            setExerciseTime("");
            setExerciseWeight("");
            setShowExerciseForm(false);
        } catch (error) {
            console.error("Error adding exercise:", error.message);
        }
    };

    const handleDeleteExercise = async (index) => {
        try {
            const response = await fetch("http://localhost:3001/deleteExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exerciseIndex: index,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);
        } catch (error) {
            console.error("Error deleting exercise:", error.message);
        }
    };

    const handleEditExercise = (index) => {
        // Set the edit state and populate values for the selected exercise
        setEditExerciseIndex(index);
        const selectedExercise = exercises[index];
        setEditedExerciseName(selectedExercise.name);
        setEditedNumberOfSets(selectedExercise.sets);
        setEditedNumberOfRepetitions(selectedExercise.repetitions);
        setEditedExerciseTime(selectedExercise.time);
        setEditedExerciseWeight(selectedExercise.weight);
        const allExercises = document.querySelectorAll(".exercise");
        allExercises.forEach(exercise => {
            exercise.classList.add("hidden");
        });
    };

    const handleUpdateExercise = async (index) => {
        try {
            // Validate edited exercise name before submitting
            if (!editedExerciseName) {
                console.error("Exercise name is required.");
                return;
            }

            const response = await fetch("http://localhost:3001/updateExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exerciseIndex: index,
                    updatedExercise: {
                        name: editedExerciseName || "N/A",
                        sets: editedNumberOfSets || "N/A",
                        repetitions: editedNumberOfRepetitions || "N/A",
                        time: editedExerciseTime || "N/A",
                        weight: editedExerciseWeight || "N/A",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);

            // Reset the exercise editing state
            setEditExerciseIndex(null);
            setEditedExerciseName("");
            setEditedNumberOfSets("");
            setEditedNumberOfRepetitions("");
            setEditedExerciseTime("");
            setEditedExerciseWeight("");
            const allExercises = document.querySelectorAll(".exercise");
            allExercises.forEach(exercise => {
                exercise.classList.remove("hidden");
            });
        } catch (error) {
            console.error("Error updating exercise:", error.message);
        }
    };

    const fetchUpdatedExercises = async () => {
        try {
            const response = await fetch(`http://localhost:3001/getExercises/${username}/${selectedWorkoutIndex}/${selectedDay}`);
            if (response.ok) {
                const data = await response.json();
                return data.exercises || [];
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching exercises:", error.message);
            return [];
        }
    };

    return (
        <div className="container">
            <div className="day-panel">
                <h1>Workouts</h1>
                {userWorkouts.map((workout, index) => (
                    <div
                        key={index}
                        className={`workout-item ${hoveredWorkoutIndex === index ? "hovered" : ""} ${selectedWorkoutIndex === index ? "selected-workout" : ""}`}
                        onMouseEnter={() => setHoveredWorkoutIndex(index)}
                        onMouseLeave={() => setHoveredWorkoutIndex(null)}
                        onClick={() => selectWorkout(index)}
                    >
                        <h2>{workout.workoutName}</h2>
                        {hoveredWorkoutIndex === index && (
                            <div className="action-icons">
                                <span className="delete-icon" onClick={() => handleDelete(index)}>
                                    🗑️
                                </span>
                                <span className="delete-icon" onClick={() => handleEdit(index)}>
                                    ✏️
                                </span>
                            </div>
                        )}
                        {showEditForm && editIndex === index && (
                            <div className="workout-form">
                                <input
                                    type="text"
                                    placeholder="Enter new workout name"
                                    className="workout-name"
                                    value={editWorkoutName}
                                    onChange={(e) => setEditWorkoutName(e.target.value)}
                                />
                                <div className="form-buttons">
                                    <button onClick={handleEditSubmit} className="create-workout">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="create-workout">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <h3 className="add" onClick={addWorkout}>
                    Add a new workout schedule <span className="add-button">+</span>
                </h3>
                {showForm && (
                    <div className="workout-form">
                        <input
                            type="text"
                            placeholder="Enter workout name"
                            className="workout-name"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                        />
                        <div className="form-buttons">
                            <button onClick={handleCreateSubmit} className="create-workout">
                                Create
                            </button>
                            <button onClick={handleCancel} className="create-workout">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="dashboard">
                <div className="dashboard-nav">
                    <h1 className="username">{username}'s Dashboard</h1>
                    <div className="account">
                        <img src={userLogo} alt="user" />
                    </div>
                </div>
                {userWorkouts[selectedWorkoutIndex] && (
                    <div className="dropdown">
                        <div className={`select ${showDropdown ? "select-clicked" : ""}`} onClick={toggleDropdown}>
                            <span className={`selected ${showDropdown ? "" : ""}`}>{selectedDay}</span>
                            <div className={`caret ${showDropdown ? "caret-rotate" : ""}`}></div>
                        </div>
                        <ul className={`menu ${showDropdown ? "menu-open" : ""}`}>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <li key={day} className={selectedDay === day ? "active" : ""} onClick={() => selectDay(day)}>
                                    {day}
                                </li>
                            ))}
                        </ul>
                        <div className="addExcercise" onClick={displayExerciseForm}>
                            +
                        </div>
                    </div>
                )}
                {showExerciseForm && (
                    <div className="exercise-form">
                        <input
                            type="text"
                            placeholder="Exercise Name"
                            className="exercise-name"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Number of Sets"
                            className="number-of-sets"
                            value={numberOfSets}
                            onChange={(e) => setNumberOfSets(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Number of Repetitions"
                            className="number-of-repetitions"
                            value={numberOfRepetitions}
                            onChange={(e) => setNumberOfRepetitions(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            className="exercise-time"
                            value={exerciseTime}
                            onChange={(e) => setExerciseTime(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Weight"
                            className="exercise-weight"
                            value={exerciseWeight}
                            onChange={(e) => setExerciseWeight(e.target.value)}
                        />
                        <div className="form-buttons">
                            <button onClick={handleExerciseSubmit} className="create-exercise">
                                Submit
                            </button>
                            <button onClick={() => setShowExerciseForm(false)} className="create-exercise">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {userWorkouts[selectedWorkoutIndex] ? (
                    <div className="exercises-list">
                        <h2>Exercises for {userWorkouts[selectedWorkoutIndex]?.workoutName} - {selectedDay}</h2>
                        <ul>
                            {exercises.map((exercise, index) => (
                                <li key={index} className="exercise-item">
                                    <div className="exercise">
                                        <div className="excercise-header">
                                            <h3>{exercise.name}</h3>
                                            <div className="action-icons exercise-icons">
                                                <span className="icon" onClick={() => handleDeleteExercise(index)}>
                                                    🗑️
                                                </span>
                                                {editExerciseIndex === index ? (
                                                    <>
                                                        <span className="icon" onClick={() => handleUpdateExercise(index)}>
                                                            ✔️
                                                        </span>
                                                        <span className="icon" onClick={() => setEditExerciseIndex(null)}>
                                                            ❌
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="icon" onClick={() => handleEditExercise(index)}>
                                                        ✏️
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="exercise-body">
                                            <div className="exercise-info-row">
                                                <div className="exercise-info-item">
                                                    <h4>Sets</h4>
                                                    <p>{exercise.sets}</p>
                                                </div>
                                                <div className="exercise-info-item">
                                                    <h4>Reps</h4>
                                                    <p>{exercise.repetitions}</p>
                                                </div>
                                                <div className="exercise-info-item">
                                                    <h4>Time</h4>
                                                    <p>{exercise.time}</p>
                                                </div>
                                                <div className="exercise-info-item no-pad">
                                                    <h4>Weight</h4>
                                                    <p>{exercise.weight}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Show edit form below the exercise being edited */}
                                    {editExerciseIndex === index && (
                                        <div className="edit-exercise-form">
                                            Name:<input
                                                type="text"
                                                placeholder="Edit Exercise Name"
                                                className="exercise-name heading"
                                                value={editedExerciseName}
                                                onChange={(e) => setEditedExerciseName(e.target.value)}
                                            />
                                            Sets:<input
                                                type="text"
                                                placeholder="Edit Number of Sets"
                                                className="number-of-sets"
                                                value={editedNumberOfSets}
                                                onChange={(e) => setEditedNumberOfSets(e.target.value)}
                                            />
                                            Reps<input
                                                type="text"
                                                placeholder="Edit Number of Repetitions"
                                                className="number-of-repetitions"
                                                value={editedNumberOfRepetitions}
                                                onChange={(e) => setEditedNumberOfRepetitions(e.target.value)}
                                            />
                                            Time:<input
                                                type="text"
                                                placeholder="Edit Time"
                                                className="exercise-time"
                                                value={editedExerciseTime}
                                                onChange={(e) => setEditedExerciseTime(e.target.value)}
                                            />
                                            Weight:<input
                                                type="text"
                                                placeholder="Edit Weight"
                                                className="exercise-weight"
                                                value={editedExerciseWeight}
                                                onChange={(e) => setEditedExerciseWeight(e.target.value)}
                                            />
                                            <div className="ex-form-buttons">
                                                <button onClick={() => handleUpdateExercise(index)} className="create-exercise">
                                                    Save
                                                </button>
                                                <button onClick={displayBackAndSet} className="create-exercise">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="fix-top-margin">
                        <h2>No workout selected</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
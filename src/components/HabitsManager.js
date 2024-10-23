// src/components/HabitsManager.js

import React, { useState } from 'react';
import './HabitsManager.css';

const HabitsManager = ({ habitsList, setHabitsList, toggleHabitsManager }) => {
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    const habit = newHabit.trim();
    if (habit && !habitsList.includes(habit)) {
      setHabitsList([...habitsList, habit]);
      setNewHabit('');
    }
  };

  const removeHabit = (habit) => {
    setHabitsList(habitsList.filter((h) => h !== habit));
  };

  return (
    <div className="habits-manager-overlay">
      <div className="habits-manager">
        <h2>Manage Your Habits</h2>
        <button className="close-button" onClick={toggleHabitsManager}>
          ✕
        </button>
        <ul>
          {habitsList.map((habit) => (
            <li key={habit}>
              {habit}
              <button onClick={() => removeHabit(habit)}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="add-habit-form">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit"
          />
          <button onClick={addHabit}>Add Habit</button>
        </div>
      </div>
    </div>
  );
};

export default HabitsManager;
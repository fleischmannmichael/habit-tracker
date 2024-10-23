// src/components/MonthView.js
import React from 'react';
import './MonthView.css';
import { format, isLeapYear } from 'date-fns';

const habitsList = ['Reading', 'Exercise', 'Study'];

const MonthView = ({ selectedMonth, habitData, setHabitData, onBackToYear }) => {
  const currentYear = new Date().getFullYear();
  const leapYear = isLeapYear(new Date(currentYear, 0, 1));

  const monthNames = [
    { name: 'January', days: 31 },
    { name: 'February', days: leapYear ? 29 : 28 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 },
  ];

  const month = monthNames[selectedMonth];

  const handleHabitToggle = (dateKey, habit) => {
    setHabitData((prevData) => {
      const dayData = prevData[dateKey] || {};
      return {
        ...prevData,
        [dateKey]: {
          ...dayData,
          [habit]: !dayData[habit],
        },
      };
    });
  };

  const handleNoteChange = (dateKey, e) => {
    const note = e.target.value;
    setHabitData((prevData) => ({
      ...prevData,
      [dateKey]: { ...prevData[dateKey], note },
    }));
  };

  return (
    <div className="month-view">
      <button onClick={onBackToYear}>Back to Year View</button>
      <h2>{month.name}</h2>
      <div className="days-grid">
        {Array.from({ length: month.days }, (_, i) => i + 1).map((day) => {
          const date = new Date(currentYear, selectedMonth, day);
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayData = habitData[dateKey] || {};

          return (
            <div
              key={day}
              className="day-card"
              style={{
                backgroundColor: Object.values(dayData).includes(true)
                  ? '#66cc66'
                  : '#ebedf0',
              }}
            >
              <div className="day-number">{day}</div>
              {habitsList.map((habit) => (
                <div key={habit} className="habit-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!dayData[habit]}
                      onChange={() => handleHabitToggle(dateKey, habit)}
                    />
                    {habit}
                  </label>
                </div>
              ))}
              <textarea
                placeholder="Write a note to your future self"
                value={dayData.note || ''}
                onChange={(e) => handleNoteChange(dateKey, e)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
// src/components/YearView.js

import React, { useState, useEffect } from 'react';
import './YearView.css';
import {
  format,
  eachDayOfInterval,
  getISODay,
  isToday,
  isLeapYear,
  differenceInCalendarWeeks,
  startOfWeek,
  startOfYear,
} from 'date-fns';

const YearView = ({
  habitData,
  setHabitData,
  habitsList,
  handleMonthClick,
  showMonthMenu,
  selectedMonth,
  closeMonthMenu,
}) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentYear = new Date().getFullYear();
  const isLeap = isLeapYear(new Date(currentYear, 0, 1));

  const months = [
    { name: 'Jan', days: 31 },
    { name: 'Feb', days: isLeap ? 29 : 28 },
    { name: 'Mar', days: 31 },
    { name: 'Apr', days: 30 },
    { name: 'May', days: 31 },
    { name: 'Jun', days: 30 },
    { name: 'Jul', days: 31 },
    { name: 'Aug', days: 31 },
    { name: 'Sep', days: 30 },
    { name: 'Oct', days: 31 },
    { name: 'Nov', days: 30 },
    { name: 'Dec', days: 31 },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const totalDays = eachDayOfInterval({
    start: new Date(currentYear, 0, 1),
    end: new Date(currentYear, 11, 31),
  });

  const weeks = [];
  let currentWeek = [];
  let firstDayOfYear = getISODay(new Date(currentYear, 0, 1)); // 1 (Monday) to 7 (Sunday)

  if (firstDayOfYear !== 1) {
    for (let i = 1; i < firstDayOfYear; i++) {
      currentWeek.push(null);
    }
  }

  totalDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const totalWeeks = weeks.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.tooltip') &&
        !event.target.classList.contains('day-cell') &&
        !event.target.classList.contains('month-name') &&
        !event.target.closest('.month-menu')
      ) {
        setSelectedDay(null);
        closeMonthMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMonthMenu]);

  const getColorForDay = (dateKey) => {
    const dayData = habitData[dateKey] || {};
    if (dayData.blocked) {
      return '#ff9800'; // Orange color for blocked days
    }
    const completedHabits = habitsList.filter((habit) => dayData[habit]).length;

    switch (completedHabits) {
      case 1:
        return '#aed581'; // Light green
      case 2:
        return '#81c784'; // Medium green
      case 3:
      case 4:
      case 5:
        return '#4caf50'; // Dark green
      default:
        return '#e0e0e0'; // Default cell color (light gray)
    }
  };

  const handleDayClick = (day, event) => {
    if (!day) return;
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayCell = event.target;
    const dayCellRect = dayCell.getBoundingClientRect();
    const tooltipWidth = 220; // Width defined in CSS
    const tooltipHeight = 260; // Approximate height including content

    let tooltipTop = dayCellRect.top + dayCellRect.height / 2 - tooltipHeight / 2;
    let tooltipLeft = dayCellRect.left + dayCellRect.width + 10; // Position to the right

    if (tooltipLeft + tooltipWidth > window.innerWidth) {
      tooltipLeft = dayCellRect.left - tooltipWidth - 10; // Position to the left
    }

    if (tooltipTop < 0) {
      tooltipTop = 10; // Set to a minimum top offset
    }

    if (tooltipTop + tooltipHeight > window.innerHeight) {
      tooltipTop = window.innerHeight - tooltipHeight - 10; // Set to a maximum top offset
    }

    setTooltipPosition({
      top: tooltipTop,
      left: tooltipLeft,
    });
    setSelectedDay(dateKey);
  };

  const handleHabitToggle = (dateKey, habit) => {
    setHabitData((prevData) => {
      const dayData = prevData[dateKey] ? { ...prevData[dateKey] } : {};
      dayData[habit] = !dayData[habit];
      return {
        ...prevData,
        [dateKey]: dayData,
      };
    });
  };

  const handleNoteChange = (dateKey, note) => {
    setHabitData((prevData) => {
      const dayData = prevData[dateKey] ? { ...prevData[dateKey] } : {};
      dayData.note = note;
      return {
        ...prevData,
        [dateKey]: dayData,
      };
    });
  };

  const toggleBlockDay = (dateKey) => {
    setHabitData((prevData) => {
      const dayData = prevData[dateKey] ? { ...prevData[dateKey] } : {};
      dayData.blocked = !dayData.blocked;
      return {
        ...prevData,
        [dateKey]: dayData,
      };
    });
  };

  const getMonthStartWeek = (monthIndex) => {
    const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
    const weekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const weekNumber = differenceInCalendarWeeks(
      weekStart,
      startOfYear(new Date(currentYear, 0, 1)),
      { weekStartsOn: 1 }
    );
    return weekNumber + 1;
  };

  const monthSpans = months.map((month, index) => {
    const startWeek = getMonthStartWeek(index);
    const endWeek = getMonthStartWeek(index + 1) || totalWeeks;
    const span = endWeek - startWeek;
    return span > 0 ? span : 1;
  });

  const toggleBlockMonth = () => {
    const monthStart = new Date(currentYear, selectedMonth, 1);
    const monthEnd = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const isBlocked = isMonthBlocked();

    daysInMonth.forEach((day, index) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      setTimeout(() => {
        setHabitData((prevData) => {
          const dayData = prevData[dateKey] ? { ...prevData[dateKey] } : {};
          dayData.blocked = !isBlocked;
          return {
            ...prevData,
            [dateKey]: dayData,
          };
        });
      }, index * 50); // Delay for aesthetic effect
    });

    closeMonthMenu();
  };

  const isMonthBlocked = () => {
    const monthStart = new Date(currentYear, selectedMonth, 1);
    const monthEnd = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.every((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      return habitData[dateKey]?.blocked;
    });
  };

  return (
    <div className="year-view">
      <div className="heatmap-wrapper">
        <div className="header">
          <h1>Habit Tracker</h1>
        </div>

        <div className="month-labels">
          {months.map((month, index) => (
            <div
              key={index}
              className="month-name"
              style={{
                gridColumnStart: getMonthStartWeek(index),
                gridColumnEnd: `span ${monthSpans[index]}`,
              }}
              onClick={() => handleMonthClick(index)}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className="heatmap-container">
          <div className="days-of-week">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-label">
                {day}
              </div>
            ))}
          </div>

          <div
            className="week-grid"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, 14px)`,
            }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week-column">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div key={dayIndex} className="day-cell background-cell" />
                    );
                  }
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const backgroundColor = getColorForDay(dateKey);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={dayIndex}
                      className={`day-cell ${
                        isCurrentDay ? 'current-day' : ''
                      } ${habitData[dateKey]?.blocked ? 'blocked' : ''}`}
                      style={{ backgroundColor }}
                      onClick={(event) => handleDayClick(day, event)}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDay && (
        <div
          className="tooltip"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          <p>{format(new Date(selectedDay), 'EEE, MMM d yyyy')}</p>
          <div className="habit-list">
            {habitsList.map((habit) => (
              <label key={habit} className="habit-checkbox">
                <input
                  type="checkbox"
                  checked={!!habitData[selectedDay]?.[habit]}
                  onChange={() => handleHabitToggle(selectedDay, habit)}
                />
                {habit}
              </label>
            ))}
          </div>
          <textarea
            placeholder="Your note..."
            value={habitData[selectedDay]?.note || ''}
            onChange={(e) => handleNoteChange(selectedDay, e.target.value)}
          />
          <button onClick={() => toggleBlockDay(selectedDay)}>
            {habitData[selectedDay]?.blocked ? 'Unblock Day' : 'Block Day'}
          </button>
        </div>
      )}

      {showMonthMenu && (
        <>
          <div className="overlay"></div>
          <div className={`month-menu show`}>
            <h3>
              {months[selectedMonth].name} {currentYear}
            </h3>
            <button onClick={toggleBlockMonth}>
              {isMonthBlocked() ? 'Unblock Month' : 'Block Month'}
            </button>
            <button onClick={closeMonthMenu}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default YearView;
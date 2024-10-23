// src/App.js
import React, { useState, useEffect } from 'react';
import YearView from './components/YearView';
import HabitsManager from './components/HabitsManager';
import './App.css';
import { auth, database, isFirebaseConfigured } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [habitData, setHabitData] = useState({});
  const [habitsList, setHabitsList] = useState([]);
  const [showHabitsManager, setShowHabitsManager] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setLoading(false);
        } else {
          signInAnonymously(auth)
            .then((userCredential) => {
              setUser(userCredential.user);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Anonymous sign-in error:', error);
              setLoading(false);
            });
        }
      });

      return () => unsubscribe();
    } else {
      setLoading(false); // Skip loading if no Firebase
    }
  }, []);

  // Load data from Firebase if available
  useEffect(() => {
    if (user && isFirebaseConfigured) {
      const habitDataRef = ref(database, `users/${user.uid}/habitData`);
      const unsubscribe = onValue(habitDataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHabitData(data);
        } else {
          setHabitData({});
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user && isFirebaseConfigured) {
      const habitsListRef = ref(database, `users/${user.uid}/habitsList`);
      const unsubscribe = onValue(habitsListRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const habitsArray = Object.values(data);
          setHabitsList(habitsArray);
        } else {
          setHabitsList(['Reading', 'Exercise', 'Meditation']); // Default habits
        }
      });

      return () => unsubscribe();
    } else if (!isFirebaseConfigured) {
      setHabitsList(['Reading', 'Exercise', 'Meditation']); // Default habits in local mode
    }
  }, [user]);

  // Save habit data to Firebase or stay local
  useEffect(() => {
    if (user && isFirebaseConfigured && Object.keys(habitData).length > 0) {
      const habitDataRef = ref(database, `users/${user.uid}/habitData`);
      set(habitDataRef, habitData).catch((error) => {
        console.error('Error saving habit data:', error);
      });
    } else if (!isFirebaseConfigured) {
      // Keep habit data in local state for local mode
      localStorage.setItem('habitData', JSON.stringify(habitData));
    }
  }, [habitData, user]);

  // Save habits list to Firebase or stay local
  useEffect(() => {
    if (user && isFirebaseConfigured && habitsList.length > 0) {
      const habitsListRef = ref(database, `users/${user.uid}/habitsList`);
      const dataToSave = {};
      habitsList.forEach((habit, index) => {
        dataToSave[index] = habit;
      });
      set(habitsListRef, dataToSave).catch((error) => {
        console.error('Error saving habits list:', error);
      });
    } else if (!isFirebaseConfigured) {
      // Save to local storage for local mode
      localStorage.setItem('habitsList', JSON.stringify(habitsList));
    }
  }, [habitsList, user]);

  const toggleHabitsManager = () => {
    setShowHabitsManager(!showHabitsManager);
  };

  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setShowMonthMenu(true);
  };

  const closeMonthMenu = () => {
    setSelectedMonth(null);
    setShowMonthMenu(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <YearView
        habitData={habitData}
        setHabitData={setHabitData}
        habitsList={habitsList}
        handleMonthClick={handleMonthClick}
        showMonthMenu={showMonthMenu}
        selectedMonth={selectedMonth}
        closeMonthMenu={closeMonthMenu}
      />
      {showHabitsManager && (
        <HabitsManager
          habitsList={habitsList}
          setHabitsList={setHabitsList}
          toggleHabitsManager={toggleHabitsManager}
        />
      )}
      <button className="manage-button" onClick={toggleHabitsManager}>
        +
      </button>
    </div>
  );
};

export default App;
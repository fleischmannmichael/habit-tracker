
# Habit Tracker
![Screenshot 2024-10-23 at 18 59 58](https://github.com/user-attachments/assets/801a1914-a30e-4f62-99da-f692a797f6be)

## Overview

The **Habit Tracker** is a fully-featured web application that allows users to track their daily habits through an intuitive heatmap interface. The application integrates Firebase for real-time data storage, synchronization, and user authentication. The app is designed to help users manage their habits by allowing them to track completions, log missed days, and monitor their progress over the year.

## Features

- **Interactive Heatmap:** Visual representation of a user’s habit-tracking data throughout the year.
- **Add/Edit/Delete Habits:** Users can manage their habits through an easy-to-use interface.
- **Mark Completed or Skipped Days:** Users can click on individual days to mark habits as completed (green) or skipped (orange).
- **Firebase Integration:**
  - **Realtime Database:** For storing user data (habits and progress).
  - **Anonymous Authentication:** Each user gets a unique user ID to store their data.
- **Responsive Design:** Works across devices, ensuring a smooth user experience on mobile, tablet, and desktop screens.
- **Future-Proof Layout:** Space is left for potential future integrations, such as syncing with Google Calendar.

---

## Technologies Used

- **Frontend:**
  - react
  - css
  - date-fns

- **Backend:**
  - Firebase

---

## Project Setup

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker

2. Install the required dependencies:

		npm install


3. Create a Firebase project:
	Go to Firebase, create a new project, and enable Realtime Database and Authentication (Anonymous Sign-In).
4. Configure Firebase:
	Copy your Firebase config values into src/firebase.js.
	
		const firebaseConfig = {
		  apiKey: "YOUR_API_KEY",
		  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
		  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
		  projectId: "YOUR_PROJECT_ID",
		  storageBucket: "YOUR_PROJECT_ID.appspot.com",
		  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
		  appId: "YOUR_APP_ID",
		};


5. Start the development server:

		npm start


6. Access the application:
	Open http://localhost:3000 in your browser.

7. Firebase Configuration
	Firebase Setup
	
	Realtime Database:
		Navigate to the Realtime Database section in Firebase.
		Set your database rules for anonymous read/write access:

		{
		  "rules": {
		    ".read": "auth != null",
		    ".write": "auth != null"
		  }
		}


	Authentication:
		Go to the Authentication section.
		Enable Anonymous Authentication.

	Storing User Data
	
	User data will be stored in the following structure in Firebase:

		users/
		  userId/
		    habits/
		      habitId/
		        name: "Read Book",
		        createdAt: "2024-01-01T00:00:00Z"
		    progress/
		      2024-01-01: { completed: true }

## App Functionality

1. Heatmap Visualization

The heatmap displays a grid of 53 weeks, with each square representing a day. Clicking on any day opens a tooltip with options to mark the habit as completed or skipped.

	•	Green squares: Completed days.
	•	Orange squares: Skipped days.

2. Habit Management

In the “Habits Manager,” users can:

	•	Add new habits by typing a name and clicking the “+” button.
	•	Remove habits by selecting them from the list.
	•	Edit habits if needed.

3. Real-Time Data Syncing

All habit and progress data is saved automatically in the Firebase Realtime Database and can be accessed by users after they log in or sign in anonymously.

## File Structure
	
	habit-tracker/
	│
	├── public/                # Static public assets (favicon, etc.)
	├── src/
	│   ├── components/        # React components
	│   │   ├── YearView.js    # Heatmap for year overview
	│   │   ├── HabitsManager.js # Manage adding/editing habits
	│   │   ├── YearView.css   # CSS for heatmap
	│   │   └── HabitsManager.css # CSS for habit management
	│   ├── firebase.js        # Firebase configuration
	│   ├── App.js             # Main App component
	│   ├── App.css            # Main App styling
	│   └── index.js           # React entry point
	│
	└── package.json           # Project metadata and dependencies

## Future Enhancements

Google Calendar Integration:
	Allow users to sync their habit data with Google Calendar and set reminders.
Habit Streaks:
	Display consecutive streaks for habits to encourage users to maintain consistency.
Dark Mode:
	Add a theme toggle for dark/light mode for user convenience.

Contributing

Feel free to fork this repository and submit pull requests to improve the app or add new features. Any feedback or contributions are highly appreciated!

License

This project is licensed under the MIT License - see the LICENSE file for details.

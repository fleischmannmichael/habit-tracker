# Habit Tracker Application

This is a Habit Tracker application built using React, Firebase, and various libraries like `date-fns`. The app allows users to track daily habits through an interactive heatmap.

## Features
- **Heatmap Visualization**: Visualizes the user's habit completion for each day of the year.
- **Firebase Integration**: Stores and retrieves habit data using Firebase Realtime Database.
- **Authentication**: Uses Firebase Authentication for anonymous user login.
- **Habit Management**: Allows users to add, edit, and remove habits.

## Installation

1. Clone the repository:

    ```bash
    git clone <your-repo-url>
    cd habit-tracker-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure Firebase:

    - Add your Firebase configuration in a file named `firebase.js` in the `src` folder.

4. Run the app locally:

    ```bash
    npm start
    ```

## Technologies
- **React** (Create React App)
- **Firebase Realtime Database** and **Firebase Authentication**
- **date-fns** for date handling

## Future Plans
- Google Calendar Integration
- Push Notifications for habit reminders
# Full-Stack Dynamic Dashboard

Welcome to the Full-Stack Dynamic Dashboard, a comprehensive web application built with a modern tech stack. This application provides users with a secure, interactive, and fully responsive platform to manage sales, transactions, schedules, and user profiles. With a dynamic charting system and a clean, intuitive interface, this project serves as a powerful tool for data visualization and management.

---

## Live Link: https://uboard.netlify.app/login

---

## ✨ Features

- **Secure User Authentication**: Robust sign-in and registration system using both Google OAuth 2.0 and traditional email/password.
- **Dynamic Data Visualization**: Interactive bar and donut charts on the dashboard that are dynamically generated from user data.
- **Full CRUD Functionality**: Users can Create, Read, Update, and Delete records for sales, transactions, schedules, and user profiles.
- **Responsive Design**: A seamless user experience across all devices, from large desktops to mobile phones, with a mobile-friendly navigation sidebar.
- **Live Server Monitoring**: A built-in health check system to monitor the backend server's status in real-time.
- **Multi-Page Routing**: A clean, client-side routing system that provides a smooth single-page application (SPA) experience.

---

## 📸 Screenshots

Here you can showcase your application. Simply replace the placeholder links with your own screenshots.

| Sign-In Page | Main Dashboard |
| :---: | :---: |
| <img width="1249" height="665" alt="Sign-In Page" src="https://github.com/user-attachments/assets/c0f516d1-fd28-488d-8333-b9f07a60b539" /> | <img width="1371" height="832" alt="Main Dashboard" src="https://github.com/user-attachments/assets/34f003a0-7557-4c9a-af7c-edeec412235e" /> |

| Transactions Page | Mobile View |
| :---: | :---: |
| <img width="1403" height="843" alt="Transactions Page" src="https://github.com/user-attachments/assets/4838d5a6-f345-4384-9eff-0695b33e3cb7" /> | <img width="427" height="842" alt="Mobile View" src="https://github.com/user-attachments/assets/85e264f6-74e8-419f-8604-40af35030c2c" /> |


---

## 🛠 Tech Stack

This project is built with a modern, full-stack architecture:

- **Frontend**:
  - **React**: A powerful JavaScript library for building user interfaces.
  - **Tailwind CSS**: A utility-first CSS framework for rapid and responsive styling.
  - **React Router**: For client-side routing and navigation.
  - **Axios**: For making API requests to the backend.
  - **Chart.js**: For creating beautiful and interactive charts.

- **Backend**:
  - **Node.js**: A JavaScript runtime for building the server.
  - **Express**: A fast and minimalist web framework for Node.js.
  - **PostgreSQL**: A powerful, open-source relational database.
  - **Sequelize**: A modern ORM (Object-Relational Mapper) for interacting with the PostgreSQL database.
  - **Passport.js**: For handling user authentication strategies (Google OAuth and local).

- **Deployment**:
  - **Frontend**: Hosted on **Netlify** for continuous deployment and global CDN.
  - **Backend**: Hosted on **Render** for managing the Node.js server and PostgreSQL database.
  - **Monitoring**: Kept active with **Uptime Robot** to prevent the free-tier backend from sleeping.

---

## 🚀 Setup and Installation

To run this project locally, you will need Node.js and a PostgreSQL database.

### 1. Backend Server (`/server`)

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `server` root and add the following variables:
    ```
    DATABASE_URL=your_postgresql_connection_string
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    COOKIE_KEY=a_long_random_secret_string
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```
    The backend will be running on `http://localhost:5001`.

### 2. Frontend Client (`/client`)

1.  **Navigate to the `client` directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the React application:**
    ```bash
    npm start
    ```
    The frontend will be running on `http://localhost:3000`.

---

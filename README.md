📌 Project Overview
Polish Pop is a mobile application built using React Native (frontend) and Node.js + Express with MySQL (backend).
It allows users to:

Browse and book nail art appointments.

Shop for nail paints and designs.

Sign up, log in, and manage their profile.

Place and view their orders, with secure CRUD operations.

The project demonstrates full-stack integration with user authentication, product listing, booking features, and real-time data handling.

🛠️ Setup Instructions
🔙 Backend Setup
To get the backend running:

Clone the repository from GitHub:
git clone https://github.com/your-username/polish-pop.git

Navigate to the backend directory:
cd polish-pop/polishpop-backend

Install all required Node.js packages:
npm install

(Optional) Create a .env file to store sensitive database config:

Example:

ini
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=polishpop
Start the backend server:
node server.js
(Make sure XAMPP or MySQL service is running)

📱 Frontend Setup
To launch the app on your device or emulator:

Navigate to the main app directory:
cd polish-pop

Install frontend dependencies:
npm install

Launch the app (ensure your Android device or emulator is running):
npx react-native run-android

🔗 Important: Replace the backend URL inside your frontend API calls (e.g., axios) with your local IP, like:
http://192.168.18.26:3000
This ensures frontend and backend can communicate when testing on a physical device.

👤 Sample User Credentials
Use these accounts for testing login and features:

Email	Password
john@example.com	secret123
testuser@example.com	testpass

You can also create your own account using the signup functionality.

🧱 Database Migration Instructions
You can set up your MySQL database using either a GUI like phpMyAdmin or a SQL terminal.

Option 1: Using GUI
Open phpMyAdmin or MySQL Workbench

Create a database named polishpop

Import the provided schema.sql file or manually create the tables.

Option 2: Manual Table Creation
Example: Create the users table:

sql
Copy
Edit
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);
Repeat similar steps to create:

nailart_designs

nail_paints

bookings

orders

Make sure the column names match your server-side queries exactly.

📬 Postman Collection Import Steps
This project includes a Postman collection to test all APIs without writing them manually.

To import and use it:

Open Postman

Click the "Import" button (top-left)

Choose "File" and upload polish-pop-api.postman_collection.json

Once imported, you'll see all organized folders like:

Auth (Signup/Login)

Nail Art Designs

Bookings

Orders

Set the base URL (e.g., http://192.168.18.26:3000) in each request or use an environment.

✅ This collection lets you test POST, GET, PUT, DELETE operations for all major features like Users, Orders, and Bookings.


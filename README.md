# Chat App

A real-time chat application allowing users to communicate instantly. Built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time web socket communication.

## Features

*(Add key features of your application here as you develop them, e.g., User Authentication, Real-time Messaging, Private Chats, Group Chats, Online Status Indicators, etc.)*

## Technologies Used

**Frontend:**

*   React
*   Vite
*   JavaScript
*   CSS (or specify e.g., Tailwind CSS, Material UI)
*   Zustand (State Management)
*   Socket.IO Client

**Backend:**

*   Node.js
*   Express.js
*   MongoDB (Database)
*   Mongoose (ODM)
*   Socket.IO
*   JSON Web Tokens (JWT) for authentication
*   bcryptjs for password hashing
*   cookie-parser for handling cookies
*   dotenv for environment variables
*   Cloudinary (Optional: for image uploads)

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn) installed
*   MongoDB instance (local or cloud-based like MongoDB Atlas). You'll need the connection string (URI).
*   Git (optional, for cloning)

### Installation

1.  **Clone the repository (optional):**
    ```bash
    git clone <your-repository-url>
    cd chat-app
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file in the backend directory (e.g., backend/.env)
    # Add the following environment variables:
    # MONGO_URI=<your_mongodb_connection_string>
    # JWT_SECRET=<your_jwt_secret>
    # PORT=<desired_port_number_e.g_5001>
    # (Add other variables as needed)
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

## Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend server will typically start on the port specified in your `.env` file (e.g., 5001).

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend application will usually open automatically in your browser, often at `http://localhost:5173` or a similar address provided by Vite.

## API Endpoints (Backend)

### Authentication (`/api/auth`)

*   **`POST /api/auth/signup`**: Register a new user.
    *   **Request Body:**
        ```json
        {
          "fullName": "John Doe",
          "email": "john.doe@example.com",
          "password": "password123"
        }
        ```
    *   **Responses:**
        *   `201 Created`: User successfully created. Returns user object (without password) and sets a JWT cookie.
            ```json
            {
              "_id": "...",
              "fullName": "John Doe",
              "email": "john.doe@example.com",
              "profilePic": ""
            }
            ```
        *   `400 Bad Request`: Invalid input (e.g., missing fields, password too short, email already exists). Returns an error message.
            ```json
            { "message": "Email already exists" }
            ```
        *   `500 Internal Server Error`: Server-side error during signup.

*(Add other endpoints like /login, /logout as they are implemented)*

## Deployment

*(Add details on how to deploy the application later, e.g., platforms like Vercel, Netlify, Heroku, Render)*

## Credits

*   *(Add any acknowledgements or credits if applicable)*

## License

*(Specify the license for your project, e.g., MIT License)*

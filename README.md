# Chat App

A real-time chat application built with the MERN stack and Socket.IO for low-latency messaging.

- Live demo: https://real-time-go-chat-app.onrender.com/
- Repository: https://github.com/SergiyKochenko/real-time-go-chat-app

## Quick start

1. Install Node.js 20 and npm.
2. Create a MongoDB database and a Cloudinary account.
3. Configure backend environment variables in `backend/.env`:
   ```bash
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   PORT=5001
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   NODE_ENV=development
   ```
4. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
5. Start the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Documentation

- [Project documentation](docs/README.md)
- [DevOps pipeline report (CA2)](docs/ca2/DevOps_Pipeline_Report.md)
- [DevOps strategy report (CA2)](docs/ca2/CA2-DevOps-Strategy.md)
- [CA2 executive summary](docs/ca2/CA2-report.md)

## Tech stack

- Frontend: React, Vite, Zustand, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Tooling: Vitest, ESLint, Docker Compose, GitHub Actions

## Repository hygiene

Generated artifacts (for example `node_modules`, `coverage`, and build output) are excluded from version control and should be removed before packaging submissions.

## License

All rights reserved.

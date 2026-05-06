# Setup and local development

## Prerequisites

- Node.js 20 and npm
- MongoDB (local or Atlas)
- Cloudinary account (image uploads)

## Environment variables

Create `backend/.env`:

```bash
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5001
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
NODE_ENV=development
```

Create `frontend/.env` (optional for local overrides):

```bash
VITE_API_BASE_URL=http://localhost:5001
```

## Install and run

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd ../frontend
npm install
npm run dev
```

## Build for production

```bash
cd frontend
npm run build
```

The backend serves the frontend `dist` folder in production mode.

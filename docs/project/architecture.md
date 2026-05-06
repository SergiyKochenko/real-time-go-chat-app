# Architecture and API

## High-level architecture

- **Frontend:** React + Vite SPA that handles authentication, chat UI, and themes.
- **Backend:** Express API with Socket.IO for real-time events.
- **Database:** MongoDB for user profiles and message history.

## Data model overview

- **User**: name, email, password hash, profile image, timestamps.
- **Message**: sender, receiver, text, optional image URL, timestamps.

## API endpoints (backend)

### Auth

- `POST /api/auth/signup` - create a new account
- `POST /api/auth/login` - authenticate and set session cookie
- `POST /api/auth/logout` - clear session
- `PUT /api/auth/update-profile` - update profile fields and avatar

### Messages

- `GET /api/message/users` - list users for sidebar
- `GET /api/message/:id` - retrieve chat history with a user
- `POST /api/message/send/:id` - send a message to a user

## Real-time events

- `getOnlineUsers` - broadcast online user IDs
- `newMessage` - push new messages to active chats

## Frontend state management

- `useAuthStore` manages authentication state and socket connection.
- `useChatStore` manages conversations, messages, and unread updates.

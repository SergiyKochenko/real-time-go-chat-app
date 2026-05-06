# Overview

## Summary

The Chat App is a real-time messaging platform that supports authenticated users, profile management, online presence, and multimedia messages. It is built with a React frontend and a Node.js/Express backend, backed by MongoDB and Socket.IO.

## Goals

- Provide low-latency, real-time messaging with presence awareness.
- Maintain secure authentication with HTTP-only cookies and JWT.
- Support profile customization and image sharing.
- Deliver a responsive UI across desktop, tablet, and mobile.

## Key features

- Secure authentication (signup, login, logout)
- Real-time messaging via Socket.IO
- Persistent message history
- Profile management with avatar uploads
- Online/offline indicators
- Theme customization

## Future improvements

- Group chats and message search
- Reactions and read receipts
- Voice and video calling
- End-to-end message encryption

## Design notes

- The UI uses DaisyUI theme tokens for consistent component styling.
- Typography follows Tailwind defaults with clear hierarchy through font weight and spacing.
- The layout prioritizes readability in chat threads and accessibility in form flows.

## Responsiveness

The layout adapts to a wide range of viewports. The sidebar collapses for smaller screens, and chat content remains readable with optimized spacing and touch targets.

## Screenshots

![Responsive overview](../../assets/amiresponsive.png)

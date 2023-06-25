# ChatVia

- **Checkout branch "Full-Project" for full of project (front-end, back-end and socket.io)**

---

## Quick Links

[Demo](#demo)

- [Live Site Demo](#live-site-demo)
<!-- - [Video Demo](#video-demo) -->

[Tech Stack](#tech-stack)

[Implementation Hightlights](#implementation-highlights)

- [User Stories](#user-stories)
- [Current Plans for Expansion](#current-plans-for-expansion)
- [Future Plans for Expansion](#future-plans-for-expansion)

[Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

  - [Tools & Versions](#tools-&-versions)

- [Serving Application](#serving-application)

  - [Web Client](#web-client)

[Deployment](#deployment)

[Author](#author)

---

## Demo

### Live Site Demo

Demo: [Link](https://chat-via-web.vercel.app/)

<!-- ### Video Demo -->

<!-- ![demogif](https://github.com/yuchiu/netflix-clone/blob/master/netflix-clone-optimize-gif-demo.gif) -->

---

## Tech Stack

- React - Typescript - Next-JS
  - Web client development
- Redux - Redux Toolkit - Redux Toolkit Query
  - Client-side data management and fetching
- NodeJS - ExpressJs
  - Web server development
- MongoGB
  - Persisted database for users
- Socket.IO
  - Real-time server communication

---

## Implementation Highlights

- Utilized React, TypeScript, and Next.js for building the web client, providing a robust and efficient user interface.
- Leveraged Redux, Redux Toolkit, and Redux Toolkit Query for effective client-side data management and seamless data fetching from the server.
- Implemented the Node.js framework with Express.js to develop a scalable and performant web server.
- Utilized MongoDB as the persisted database to store and manage user data securely.
- Integrated Socket.IO to establish real-time communication between the server and clients, enabling instant updates and notifications.
- Implemented ESLint for code linting, ensuring consistent code style and identifying potential errors or issues early in the development process.
- Utilized commitlint and Husky for enforcing commit message conventions and pre-commit hooks, promoting code quality and maintainability.
- Documented the codebase and provided clear and concise comments to enhance code readability and facilitate future maintenance and updates.

---

## User Stories

### Auth page

- Users can create an account and log in to the chat messaging web application.
- Users are able to logout from the chat messaging web application.

### Main chat page

- Users are able to receive real-time notifications for new messages.
- Users are able to send text messages, emojis, and images in a conversation.
- Users are able to change the primary emoji in a conversation.
- Users are able to edit and delete messages that they have sent.
- Users are able to view all the images they have shared in a conversation.

### Available conversation section

- Users can see who is online or offline.
- Users are able to start a new conversation with a contact by providing their email.
- Users are able to delete a conversation. After a conversation is deleted, the latest message will be the message sent after the deletion.

### Pending conversation section

- When a conversation is created, it has a `pending` status, and it can move to the main chat page only the user **accepts** the conversation.
- When the conversation is `accept`, contact automatically added

### Profile section

- Users are able to customize their profile.

### Contact section

- Users are able to search in their contact list.
- Users are able to view their contact list.

### Other

- Users can switch between multiple languages.
- Users can switch between a dark or light theme.

---

### Current Plans for Expansion

- Block conversation
- Pin and UnPin a conversation/ messages

### Future Plans for Expansion

- Containerize services and database with Docker
- Video call online 1-1

---

## Getting Started

### Prerequisites

**!important** .env file is required for setting up environment variables for this project  
 an example of .env file is located at root directory

#### Tools & Versions

| Tools  | Versions |
| ------ | -------- |
| yarn   | 6.1.0    |
| nodejs | 10.7.0   |

#### Web Client

- install dependencies & start application

```terminal
yarn install
yarn dev
```

Application will be serving on http://localhost:3000

---

## Deployment

- Not setup yet

---

## Author

- [Bui Ngoc](https://www.facebook.com/Bui.Ngoc.1302/)

---

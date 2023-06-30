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

- `Front-end Technologies`: React, TypeScript, and Next.js were used to develop the web client, ensuring a robust and efficient user interface.
- `State Management`: Redux, Redux Toolkit, and Redux Toolkit Query were employed for effective client-side data management and seamless data fetching from the server.
- `Back-end Framework`: The Node.js framework with Express.js was chosen to build a scalable and high-performance web server.
- `Database`: MongoDB was used as the persisted database, providing a secure and reliable storage solution for managing user data.
- `Real-time` Communication: Socket.IO was integrated to establish real-time communication between the server and clients, enabling instant updates and notifications.
- `Code Quality`: ESLint was implemented for code linting, ensuring consistent code style and identifying potential errors or issues early in the development process.
- `Commit Conventions`: Commitlint and Husky were utilized to enforce commit message conventions and pre-commit hooks, promoting code quality and maintainability.
- `Code Analysis`: SonarCloud was integrated for static code analysis and code quality checks, allowing continuous monitoring and improvement of code quality. It helps identify code smells, bugs, vulnerabilities, and maintain a high level of code quality.
- `Documentation`: The codebase was documented with clear and concise comments, enhancing code readability and facilitating future maintenance and updates.

---

## User Stories

### Auth page

- Users can create an account and log in to the chat messaging web application.
- Users are able to logout from the chat messaging web application.

### Main chat page

- Users are able to **receive real-time** notifications for new messages.
- Users are able to **send text** messages, emojis, and images in a conversation.
- Users are able to **change the primary emoji** in a conversation.
- Users are able to **edit and delete messages** that they have sent.
- Users are able to **view all the images** they have shared in a conversation.
- Users can **block conversations**. When a conversation is blocked, users cannot send any messages until they unblock it.
- Users are able to **pin** or **unpin** a message.

### Available conversation section

- Users can see who is **online** or **offline**.
- Users are able to **start a new conversation** with a contact by providing their email.
- Users are able to **delete a conversation**. After a conversation is deleted, the latest message will be the message sent after the deletion.

### Pending conversation section

- When a conversation is created, it has a `pending` status, and it can move to the main chat page only the user **accepts** the conversation.
- When the conversation is `accept`, contact automatically added

### Profile section

- Users are able to **customize their profile**.

### Contact section

- Users are able to **search in their contact** list.
- Users are able to **view their contact list**.

### Other

- Users can **switch between multiple languages**.
- Users can **switch between a dark or light theme**.

---

### Current Plans for Expansion

- Containerize services and database with Docker

### Future Plans for Expansion

- Video call online 1-1

---

## Getting Started

### Prerequisites

**!important** .env file is required for setting up environment variables for this project  
 an example of .env file is located at root directory

#### Tools & Versions

| Tools  | Versions |
| ------ | -------- |
| yarn   | 1.22.19  |
| nodejs | v16.20.0 |

#### Web Client

- clone project

```terminal
git clone https://github.com/ngoc2003/ChatVia.git

cd ChatVia/

git checkout -b Full-code

git pull origin Full-code
```

- install dependencies & start server

```terminal
cd server/

yarn install

yarn start
```

Server will be running on `http://localhost:4000`

- install dependencies & start socket server

```terminal
cd socket/

yarn install

yarn server
```

Server will be running on `http://localhost:5000`

- install dependencies & start application

```terminal
cd client/

yarn install

yarn dev
```

Application will be serving on `http://localhost:3000`

---

## Deployment

- Not setup yet

---

## Author

- [Bui Ngoc](https://www.facebook.com/Bui.Ngoc.1302/)

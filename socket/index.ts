import http from "http";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server);

let users: any = [];

const handleAddUser = (id: string, socketId: string) => {
  if (!users.some((user: any) => user.userId === id)) {
    users.push({ userId: id, socketId });
  }
};

const removeUser = (socketId: string) => {
  users = users.filter((user: any) => user.socketId !== socketId);
};

const getUser = (id: string) => {
  return users.find((user: any) => user.userId === id);
};

io.on("connection", (socket: Socket) => {
  socket.on("addUser", (id: string) => {
    handleAddUser(id, socket.id);
    socket.emit("getUsers", users);
    console.log(`A user connected! There are ${users.length} in group chat!`);
  });

  socket.on(
    "sendMessage",
    ({ senderId, receiverId, text, conversationId, conversationStatus }) => {
      console.log("Text sent");
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        conversationId,
        senderId,
        text,
        conversationStatus,
      });
      socket.emit("self_getMessage", {
        conversationId,
        senderId,
        text,
        conversationStatus,
      });
    }
  );

  socket.on("changeIcon", ({ icon, receiverId, conversationId }) => {
    console.log("Icon change");
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getIconChanged", {
      icon,
      conversationId,
    });
  });

  socket.on("blockConversation", ({ conversationId, senderId, receiverId }) => {
    console.log("Block conversation");
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getBlockedConversation", {
      conversationId,
      senderId,
    });
  });

  socket.on("unBlockConversation", ({ conversationId, receiverId }) => {
    console.log("Unblock conversation");
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getBlockedConversation", {
      conversationId,
      senderId: "",
    });
  });

  socket.on("createConversation", ({ receiverId, ...remain }) => {
    const user = getUser(receiverId);
    console.log("Create conversation");
    io.to(user?.socketId).emit("getConversation", remain);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
    removeUser(socket.id);
    socket.emit("getUsers", users);
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (_: Request, res: Response) => {
  res.json("K");
});
